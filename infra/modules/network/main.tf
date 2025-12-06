/**
 * modules/network/main.tf
 */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.15.0"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  selected_azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

# --- VPC ---
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# --- Internet Gateway ---
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# --- Private Subnets ---
resource "aws_subnet" "private" {
  for_each          = toset(local.selected_azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, index(local.selected_azs, each.key))
  availability_zone = each.key

  tags = {
    Name = "${var.project_name}-private-${each.key}"
  }
}

# --- Public Subnets ---
resource "aws_subnet" "public" {
  for_each          = toset(local.selected_azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, index(local.selected_azs, each.key) + 10)
  availability_zone = each.key

  tags = {
    Name = "${var.project_name}-public-${each.key}"
  }
}

# --- Route Tables ---
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  # route {
  #   cidr_block     = "0.0.0.0/0"
  #   nat_gateway_id = aws_nat_gateway.example.id
  # }

  tags = {
    Name = "${var.project_name}-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  for_each       = toset(local.selected_azs)
  subnet_id      = aws_subnet.private[each.key].id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  for_each       = toset(local.selected_azs)
  subnet_id      = aws_subnet.public[each.key].id
  route_table_id = aws_route_table.public.id
}

# --- NAT Gateway ---
# resource "aws_eip" "nat" {
#   domain = "vpc"
# }

# resource "aws_nat_gateway" "example" {
#   allocation_id = aws_eip.nat.id
#   subnet_id     = aws_subnet.public[local.selected_azs[0]].id

#   tags = {
#     Name = "${var.project_name}-nat-gw"
#   }
#   depends_on = [aws_internet_gateway.igw]
# }

# --- Application Load Balancer ---
resource "aws_lb" "app_alb" {
  name               = "${var.project_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [for ps in aws_subnet.public : ps.id]

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# --- Application Load Balancer Listener ---
resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}

# --- Application Load Balancer Target Group ---
resource "aws_lb_target_group" "ecs_tg" {
  name        = "${var.project_name}-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path = "/health"
  }
}

# --- ALB Security Group ---
resource "aws_security_group" "alb_sg" {
  name        = "${var.project_name}-alb-sg"
  description = "ALB security group"
  vpc_id      = aws_vpc.main.id
}

resource "aws_vpc_security_group_ingress_rule" "alb_allow_http" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "alb_allow_https" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "alb_allow_all" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_from_alb" {
  security_group_id            = aws_security_group.ecs_sg.id
  referenced_security_group_id = aws_security_group.alb_sg.id
  from_port                    = 80
  to_port                      = 80
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb" {
  security_group_id            = aws_security_group.ecs_sg.id
  referenced_security_group_id = aws_security_group.alb_sg.id
  from_port                    = 5000
  to_port                      = 5000
  ip_protocol                  = "tcp"
}

# --- ECS Security Group ---
resource "aws_security_group" "ecs_sg" {
  name        = "${var.project_name}-ecs-sg"
  description = "Security group for ECS service"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-ecs-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
  security_group_id            = aws_security_group.ecs_sg.id
  referenced_security_group_id = aws_security_group.ec2_connect_sg.id
  from_port                    = 22
  to_port                      = 22
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "ecs_allow_all_ipv4" {
  security_group_id = aws_security_group.ecs_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# --- EC2 Connect Endpoint SG ---
resource "aws_security_group" "ec2_connect_sg" {
  name        = "${var.project_name}-ec2-connect-sg"
  description = "EC2 Connect security group"
  vpc_id      = aws_vpc.main.id
}

resource "aws_vpc_security_group_egress_rule" "ssm_allow_ssh" {
  security_group_id            = aws_security_group.ec2_connect_sg.id
  referenced_security_group_id = aws_security_group.ecs_sg.id
  from_port                    = 22
  to_port                      = 22
  ip_protocol                  = "tcp"
}

# --- ECR Endpoint SG ---
resource "aws_security_group" "ecr_ep_sg" {
  name        = "${var.project_name}-ecr-ep-sg"
  description = "ECR Endpoint Security Group"
  vpc_id      = aws_vpc.main.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_https" {
  for_each          = toset(local.selected_azs)
  security_group_id = aws_security_group.ecr_ep_sg.id
  cidr_ipv4         = aws_subnet.private[each.key].cidr_block
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

# --- VPC Endpoints ---
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = aws_route_table.private[*].id
}

resource "aws_vpc_endpoint" "dynamo" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.dynamodb"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = aws_route_table.private[*].id
}

resource "aws_ec2_instance_connect_endpoint" "ec2_connect" {
  for_each  = toset(local.selected_azs)
  subnet_id = aws_subnet.private[each.key].id

  security_group_ids = [
    aws_security_group.ec2_connect_sg.id
  ]
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.ecr.api"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.private[local.selected_azs[0]].id]

  security_group_ids = [
    aws_security_group.ecr_ep_sg.id
  ]

  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.ecr.dkr"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.private[local.selected_azs[0]].id]

  security_group_ids = [
    aws_security_group.ecr_ep_sg.id
  ]

  private_dns_enabled = true
}

# provider "aws" {
#   region = var.region
# }

# # --- VPC ---
# resource "aws_vpc" "main" {
#   cidr_block           = var.vpc_cidr
#   enable_dns_support   = true
#   enable_dns_hostnames = true

#   tags = {
#     Name = "${var.project}-vpc"
#   }
# }

# # --- Internet Gateway ---
# resource "aws_internet_gateway" "igw" {
#   vpc_id = aws_vpc.main.id

#   tags = {
#     Name = "${var.project}-igw"
#   }
# }

# # -----------------------
# # Public Subnets
# # -----------------------
# resource "aws_subnet" "public" {
#   count                   = length(var.public_subnet_cidrs)
#   vpc_id                  = aws_vpc.main.id
#   cidr_block              = element(var.public_subnet_cidrs, count.index)
#   availability_zone       = element(var.azs, count.index)
#   map_public_ip_on_launch = true

#   tags = {
#     Name = "${var.project}-public-${count.index + 1}"
#   }
# }

# # -----------------------
# # Private Subnets
# # -----------------------
# resource "aws_subnet" "private" {
#   count             = length(var.private_subnet_cidrs)
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = element(var.private_subnet_cidrs, count.index)
#   availability_zone = element(var.azs, count.index)

#   tags = {
#     Name = "${var.project}-private-${count.index + 1}"
#   }
# }

# # -----------------------
# # NAT Gateway (for private subnets)
# # -----------------------
# resource "aws_eip" "nat" {
#   vpc = true
# }

# resource "aws_nat_gateway" "nat" {
#   allocation_id = aws_eip.nat.id
#   subnet_id     = aws_subnet.public[0].id

#   tags = {
#     Name = "${var.project}-nat"
#   }
# }

# # -----------------------
# # Route Tables
# # -----------------------
# resource "aws_route_table" "public" {
#   vpc_id = aws_vpc.main.id

#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.igw.id
#   }

#   tags = {
#     Name = "${var.project}-public-rt"
#   }
# }

# resource "aws_route_table_association" "public" {
#   count          = length(aws_subnet.public)
#   subnet_id      = aws_subnet.public[count.index].id
#   route_table_id = aws_route_table.public.id
# }

# resource "aws_route_table" "private" {
#   vpc_id = aws_vpc.main.id

#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.nat.id
#   }

#   tags = {
#     Name = "${var.project}-private-rt"
#   }
# }

# resource "aws_route_table_association" "private" {
#   count          = length(aws_subnet.private)
#   subnet_id      = aws_subnet.private[count.index].id
#   route_table_id = aws_route_table.private.id
# }

# # -----------------------
# # Security Group for ECS
# # -----------------------
# resource "aws_security_group" "ecs_service" {
#   name        = "${var.project}-ecs-sg"
#   description = "Security group for ECS service"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     description = "Allow HTTP"
#     from_port   = 80
#     to_port     = 80
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     description = "Allow HTTPS"
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "${var.project}-ecs-sg"
#   }
# }

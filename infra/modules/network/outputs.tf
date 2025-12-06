/**
 * modules/network/outputs.tf
 */

output "aws_vpc_cidr_use1" {
  description = "CIDR block of VPC USE1"
  value       = aws_vpc.main.cidr_block
}

output "ec2_instance_connect_endpoint_arns" {
  description = "EC2 Instance Connection Endpoint ARN"
  value       = [for endpoint in aws_ec2_instance_connect_endpoint.ec2_connect : endpoint.arn]
}

output "aws_subnet_private_ids" {
  description = "Private subnets"
  value       = [for subnet in aws_subnet.private : subnet.id]
}

output "ecs_sg_id" {
  description = "ECS security group id"
  value       = aws_security_group.ecs_sg.id
}

output "alb_dns_name" {
  description = "ALB DNS Name"
  value       = aws_lb.app_alb.dns_name
}

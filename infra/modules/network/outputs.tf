/**
 * modules/network/outputs.tf
 */

output "aws_vpc_cidr_use1" {
  description = "CIDR block of VPC USE1"
  value       = aws_vpc.main.cidr_block
}

output "ec2_instance_connect_endpoint_arns" {
  description = "EC2 Instance Connection Endpoint ARN"
  value = {
    for az, endpoint in aws_ec2_instance_connect_endpoint.ec2_connect :
    az => endpoint.arn
  }
}

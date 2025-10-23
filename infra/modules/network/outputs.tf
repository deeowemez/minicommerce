/**
 * modules/network/outputs.tf
 */

output "aws_vpc_cidr_use1" {
  description = "CIDR block of VPC USE1"
  value       = aws_vpc.main.cidr_block
}


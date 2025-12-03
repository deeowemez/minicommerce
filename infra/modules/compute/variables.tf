/**
 * modules/compute/variables.tf
 */

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "aws_dynamo_table_arn" {
  description = "The arn of the dynamodb table where app data is stored."
  type        = string
}

variable "ec2_instance_connect_endpoint_arns" {
  description = "EC2 Instance Connection Endpoint ARN"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "ecs_sg_id" {
  description = "ECS security group id"
  type        = string
}

variable "ami_username" {
  description = "AMI username"
  type        = string
  default     = "ubuntu"
}

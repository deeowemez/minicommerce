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

variable "ami_username" {
  description = "AMI username"
  type        = string
  default     = "ubuntu"
}

/**
 * modules/iam/variables.tf
 */

variable "db_remote_state_bucket" {
  description = "The name of the bucket where remote state is stored."
  type        = string
}

variable "db_remote_state_key" {
  description = "The key where remote state is stored."
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "frontend_bucket_arn" {
  description = "The domain name of the s3 bucket where frontend is hosted."
  type        = string
}

variable "frontend_bucket_name" {
  description = "The domain name of the s3 bucket where frontend is hosted."
  type        = string
}

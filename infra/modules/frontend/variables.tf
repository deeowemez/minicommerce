/**
 * modules/frontend/variables.tf
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
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

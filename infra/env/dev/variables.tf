/**
 * env/dev/variables.tf
 */

variable "db_remote_state_bucket" {
  description = "Name of the s3 bucket where remote state is stored"
  type        = string
  default     = "mc-remote-state"
}

variable "db_remote_state_key" {
  description = "Name of the s3 bucket where remote state is stored"
  type        = string
  default     = "dev/terraform.tfstate"
}

variable "aws_region_use1" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_region_alias_use1" {
  description = "Alias for us-east-1 region"
  type        = string
  default     = "use1"
}

variable "project_name" {
  description = "Project Name"
  type        = string
  default     = "minicommerce"
}


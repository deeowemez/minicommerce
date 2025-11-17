/**
 * modules/iam/variables.tf
 */

variable "frontend_bucket_arn" {
  description = "The domain name of the s3 bucket where frontend is hosted."
  type        = string
}

variable "frontend_bucket_name" {
  description = "The domain name of the s3 bucket where frontend is hosted."
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

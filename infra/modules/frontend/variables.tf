/**
 * modules/frontend/variables.tf
 */

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "certificate_arn" {
  description = "ACM Certificate ARN"
  type        = string
}

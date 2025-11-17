/**
 * modules/network/variables.tf
 */

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR for VPC"
  type        = string
}

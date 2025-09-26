variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "project" {
  description = "Project name prefix"
  type = string
  default = "minicommerce"
}

variable "vpc_cidr" {
  description = "CIDR for VPC"
  type = string
  default = "10.30.0.0/16"
}


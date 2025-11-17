/**
 * modules/data/variables.tf
 */

variable "dynamo_table_name" {
  description = "The name of the DynamoDB table where app data is stored."
  type        = string
  default     = "AppData"
}

variable "project_name" {
  description = "Project name"
  type        = string
}

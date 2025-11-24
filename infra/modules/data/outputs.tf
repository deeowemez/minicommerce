/**
 * modules/data/outputs.tf
 */

output "aws_dynamo_table_arn" {
  value       = aws_dynamodb_table.appdata.arn
  description = "The arn of the dynamodb table where app data is stored."
}

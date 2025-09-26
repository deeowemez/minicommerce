/**
 * backend/outputs.tf
 */

output "aws_s3_bucket_remote_state" {
  value       = aws_s3_bucket.remote_state.arn
  description = "The id of the s3 bucket where remote state is stored."
}

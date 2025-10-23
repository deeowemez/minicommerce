/**
 * modules/frontend/outputs.tf
 */

output "aws_s3_bucket_name" {
  value       = aws_s3_bucket.frontend.bucket_domain_name
  description = "The domain name of the s3 bucket where frontend is hosted."
}

output "aws_s3_bucket_arn" {
  value       = aws_s3_bucket.frontend.arn
  description = "The arn of the s3 bucket where frontend is hosted."
}

output "aws_s3_bucket_website_configuration_domain" {
  value       = aws_s3_bucket_website_configuration.frontend.website_domain
  description = "The domain name of the website endpoint for the frontend."
}

output "aws_s3_bucket_website_configuration_endpoint" {
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
  description = "The website endpoint for the frontend."
}

output "aws_cloudfront_distribution_domain_name" {
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
  description = "The domain name corresponding to the distribution."
}

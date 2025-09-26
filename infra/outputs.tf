/**
 * outputs.tf
 */

output "aws_s3_bucket_name" {
  value       = module.s3.aws_s3_bucket_name
  description = "The domain name of the s3 bucket where frontend is hosted."
}

output "aws_s3_bucket_website_configuration_domain" {
  value       = module.s3.aws_s3_bucket_website_configuration_domain
  description = "The domain name of the website endpoint for the frontend."
}

output "aws_s3_bucket_website_configuration_endpoint" {
  value       = module.s3.aws_s3_bucket_website_configuration_endpoint
  description = "The website endpoint for the frontend."
}

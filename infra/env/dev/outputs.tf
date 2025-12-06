/**
 * env/dev/outputs.tf
 */

output "aws_s3_bucket_name" {
  value       = module.frontend_use1.aws_s3_bucket_name
  description = "The domain name of the s3 bucket where frontend is hosted."
}

output "aws_s3_bucket_website_configuration_domain" {
  value       = module.frontend_use1.aws_s3_bucket_website_configuration_domain
  description = "The domain name of the website endpoint for the frontend."
}

output "aws_s3_bucket_website_configuration_endpoint" {
  value       = module.frontend_use1.aws_s3_bucket_website_configuration_endpoint
  description = "The website endpoint for the frontend."
}

output "aws_cloudfront_distribution_domain_name" {
  value       = module.frontend_use1.aws_cloudfront_distribution_domain_name
  description = "The domain name corresponding to the distribution."
}

output "aws_iam_openid_connect_provider_role" {
  value       = module.iam_use1.aws_iam_openid_connect_provider_role
  description = "The ARN of the role assumed by CI/CD."
}

output "alb_dns_name" {
  value       = module.network_use1.alb_dns_name
  description = "ALB DNS Name"
}

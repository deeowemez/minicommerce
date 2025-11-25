/**
 * modules/iam/outputs.tf
 */

output "aws_iam_openid_connect_provider_role" {
  value       = aws_iam_role.allow_s3_for_ci_cd.arn
  description = "The ARN of the role assumed by CI/CD."
}

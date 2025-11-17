/**
 * modules/compute/main.tf
 */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# data "aws_iam_policy_document" "web_server_access" {
#   statement {
#     sid = "AllowEC2Permissions"
#     actions = [
#       "dynamoDB:PutObject",
#       "s3:ListBucket",
#       "s3:DeleteObject"
#     ]
#     resources = [
#       var.frontend_bucket_arn,
#       "${var.frontend_bucket_arn}/*",
#     ]
#   }
# }

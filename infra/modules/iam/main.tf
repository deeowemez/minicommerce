/**
 * modules/iam/main.tf
 */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

data "terraform_remote_state" "s3" {
  backend = "s3"

  config = {
    bucket = var.db_remote_state_bucket
    key    = var.db_remote_state_key
    region = var.aws_region
  }
}

data "aws_iam_policy_document" "allow_s3_for_ci_cd" {
  statement {
    sid = "AllowCICDToAccessS3Bucket"
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
      "s3:DeleteObject"
    ]
    resources = [
      var.frontend_bucket_arn,
      "${var.frontend_bucket_arn}/*",
    ]
  }
}

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

# data "aws_iam_openid_connect_provider" "github" {
#   url = "https://token.actions.githubusercontent.com"
# }


data "aws_iam_policy_document" "assume_ci_cd_role" {
  statement {
    sid     = "AllowCICDServiceAssumeRole"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:deeowemez/minicommerce:*"]
    }
  }
}

resource "aws_iam_role" "allow_s3_for_ci_cd" {
  name               = "AllowS3ForCICDRole"
  assume_role_policy = data.aws_iam_policy_document.assume_ci_cd_role.json
}

resource "aws_iam_role_policy" "allow_s3_for_ci_cd" {
  name   = "AllowS3ForCICDPolicy"
  role   = aws_iam_role.allow_s3_for_ci_cd.id
  policy = data.aws_iam_policy_document.allow_s3_for_ci_cd.json
}

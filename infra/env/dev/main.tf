/**
 * env/dev/main.tf
 */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  backend "s3" {
    bucket       = "mc-remote-state"
    key          = "dev/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "use1"
  region = "us-east-1"
}

module "frontend_use1" {
  source                 = "../../modules/frontend"
  providers              = { aws = aws.use1 }
  aws_region             = var.aws_region_use1
  project_name           = "${var.project_name}-${var.aws_region_alias_use1}"
  db_remote_state_bucket = var.db_remote_state_bucket
  db_remote_state_key    = var.db_remote_state_key
}

module "network_use1" {
  source                 = "../../modules/network"
  providers              = { aws = aws.use1 }
  aws_region             = var.aws_region_use1
  vpc_cidr               = "10.20.0.0/16"
  project_name           = "${var.project_name}-${var.aws_region_alias_use1}"
  db_remote_state_bucket = var.db_remote_state_bucket
  db_remote_state_key    = var.db_remote_state_key
}

module "iam_use1" {
  source                 = "../../modules/iam"
  frontend_bucket_arn    = module.frontend_use1.aws_s3_bucket_arn
  frontend_bucket_name   = module.frontend_use1.aws_s3_bucket_name
  aws_region             = var.aws_region_use1
  db_remote_state_bucket = var.db_remote_state_bucket
  db_remote_state_key    = var.db_remote_state_key
}

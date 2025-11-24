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

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.dev_env
    }
  }
}

module "frontend_use1" {
  source       = "../../modules/frontend"
  providers    = { aws = aws.use1 }
  project_name = "${var.project_name}-${var.aws_region_alias_use1}"
}

module "network_use1" {
  source       = "../../modules/network"
  providers    = { aws = aws.use1 }
  vpc_cidr     = "10.20.0.0/16"
  project_name = "${var.project_name}-${var.aws_region_alias_use1}"
}

module "iam_use1" {
  source               = "../../modules/iam"
  providers            = { aws = aws.use1 }
  frontend_bucket_arn  = module.frontend_use1.aws_s3_bucket_arn
  frontend_bucket_name = module.frontend_use1.aws_s3_bucket_name
  project_name         = "${var.project_name}-${var.aws_region_alias_use1}"
}

module "data_use1" {
  source       = "../../modules/data"
  providers    = { aws = aws.use1 }
  project_name = "${var.project_name}-${var.aws_region_alias_use1}"
}

module "compute_use1" {
  source                            = "../../modules/compute"
  providers                         = { aws = aws.use1 }
  project_name                      = "${var.project_name}-${var.aws_region_alias_use1}"
  aws_dynamo_table_arn              = module.data_use1.aws_dynamo_table_arn
  ec2_instance_connect_endpoint_arn = module.network_use1.ec2_instance_connect_endpoint_arn
}

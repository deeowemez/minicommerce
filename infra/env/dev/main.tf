/**
 * env/dev/main.tf
 */

terraform {
  backend "s3" {
    bucket = "mc-remote-state"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}

module "frontend" {
  source = "../../modules/frontend"

  db_remote_state_bucket = "mc-remote-state"
  db_remote_state_key    = "dev/terraform.tfstate"
}

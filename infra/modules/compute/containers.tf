/**
 * modules/compute/containers.tf
 */

resource "aws_ecr_repository" "priv_repo" {
  name                 = var.project_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-ecr-repo"
  }
}

resource "aws_ecs_cluster" "backend" {
  name = "${var.project_name}-ecs-cluster"

  tags = {
    Name = "${var.project_name}-ecs-cluster"
  }
}

resource "aws_ecs_capacity_provider" "managed" {
  name    = var.project_name
  cluster = "${var.project_name}-ecs-cluster"

  managed_instances_provider {
    infrastructure_role_arn = aws_iam_role.ecs_managed_instances.arn
    propagate_tags          = "CAPACITY_PROVIDER"

    instance_launch_template {
      ec2_instance_profile_arn = aws_iam_instance_profile.web_server.arn
      monitoring               = "BASIC"

      network_configuration {
        subnets         = var.private_subnet_ids
        security_groups = [var.ecs_sg_id]
      }

      storage_configuration {
        storage_size_gib = 30
      }

      instance_requirements {
        memory_mib {
          min = 1024
          max = 8192
        }

        vcpu_count {
          min = 1
          max = 4
        }

        instance_generations = ["current"]
        cpu_manufacturers    = ["intel", "amd"]
      }
    }
  }
}

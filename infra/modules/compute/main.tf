/**
 * modules/compute/main.tf
 */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.15.0"
    }
  }
}

# --- Web Server IAM Role ---
data "aws_iam_policy_document" "dynamo_table_access" {
  statement {
    sid = "AllowAppDataTableAccess"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:DeleteItem",
      "dynamodb:Scan",
      "dynamodb:DescribeTable",
    ]
    resources = [
      var.aws_dynamo_table_arn
    ]
  }
}

data "aws_iam_policy_document" "instance_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "allow_access_for_webserver" {
  name               = "AllowAccessForWebServerRole"
  assume_role_policy = data.aws_iam_policy_document.instance_assume_role_policy.json
}

resource "aws_iam_policy" "dynamo_table_access" {
  name   = "DynamoTableAccessPolicy"
  policy = data.aws_iam_policy_document.dynamo_table_access.json
}

resource "aws_iam_role_policy_attachment" "attach_policy_ec2_role" {
  role       = aws_iam_role.allow_access_for_webserver.name
  policy_arn = aws_iam_policy.dynamo_table_access.arn
}

data "aws_iam_policy_document" "ec2_instance_connect" {

  statement {
    sid    = "EC2InstanceConnect"
    effect = "Allow"

    actions = [
      "ec2-instance-connect:OpenTunnel"
    ]

    resources = var.ec2_instance_connect_endpoint_arns

    condition {
      test     = "NumericEquals"
      variable = "ec2-instance-connect:remotePort"
      values   = ["22"]
    }

    condition {
      test     = "NumericLessThanEquals"
      variable = "ec2-instance-connect:maxTunnelDuration"
      values   = ["3600"]
    }
  }

  statement {
    sid    = "SSHPublicKey"
    effect = "Allow"

    actions = [
      "ec2-instance-connect:SendSSHPublicKey"
    ]

    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "ec2:osuser"
      values   = [var.ami_username]
    }
  }

  statement {
    sid    = "Describe"
    effect = "Allow"

    actions = [
      "ec2:DescribeInstances",
      "ec2:DescribeInstanceConnectEndpoints"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_policy" "ec2_instance_connect" {
  name   = "EC2InstanceConnectPolicy"
  policy = data.aws_iam_policy_document.ec2_instance_connect.json
}

resource "aws_iam_role_policy_attachment" "attach_ec2_connect" {
  role       = aws_iam_role.allow_access_for_webserver.name
  policy_arn = aws_iam_policy.ec2_instance_connect.arn
}

resource "aws_iam_instance_profile" "web_server" {
  name = "ecsInstanceRole"
  role = aws_iam_role.allow_access_for_webserver.name
}

# --- ECS IAM Role ---
data "aws_iam_policy_document" "ecs_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs.amazonaws.com"]
    }
  }
}

data "aws_iam_policy" "ecs_managed_instances" {
  arn = "arn:aws:iam::aws:policy/AmazonECSInfrastructureRolePolicyForManagedInstances"
}

resource "aws_iam_role" "ecs_managed_instances" {
  name               = "ECSInfrastructureRoleForManagedInstances"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "attach_policy_ecs_role" {
  role       = aws_iam_role.ecs_managed_instances.name
  policy_arn = data.aws_iam_policy.ecs_managed_instances.arn
}


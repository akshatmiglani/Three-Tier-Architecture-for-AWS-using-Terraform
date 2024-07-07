// SSH KEY

resource "tls_private_key" "key" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "aws_key_pair" "access_key" {
  key_name = var.ssh_key
  public_key = tls_private_key.key.public_key_openssh
}
resource "local_file" "foo" {
  content  = tls_private_key.key.private_key_pem
  filename = "${var.ssh_key}.pem"
  file_permission = "0400"
}

// Launch Templates
// Launch Template for Bastion Host
resource "aws_launch_template" "bastion_ec2" {
  name_prefix = "bastion-ec2"
  instance_type = var.instance_type
  image_id = var.ami
  vpc_security_group_ids = [var.bastion_sg]
  key_name = var.key_name

  tags = {
    Name = "Bastion EC2 Instance"
  }
}
resource "aws_autoscaling_group" "asg-bastion" {
  name = "asg-bastion"
  vpc_zone_identifier = var.public_subnets
  min_size = 1
  max_size = 2
  desired_capacity = 1

  launch_template {
    id = aws_launch_template.bastion_ec2.id
    version = "$Latest"
  }
}

// Launch Template for Frontend

resource "aws_launch_template" "frontend-ec2" {
  name_prefix = "frontend-ec2"
  instance_type = var.instance_type
  image_id = var.ami
  vpc_security_group_ids = [var.frontend_sg]
  key_name = var.key_name
  // React App Front-end
  user_data = filebase64("frontend.sh")

  tags = {
    Name = "Frontend EC2 Instance"
  }

}
data "aws_lb_target_group" "tg" {
  name = var.tg_name
}

resource "aws_autoscaling_group" "asg-frontend" {
  name = "asg-frontend"
  vpc_zone_identifier = var.public_subnets
  min_size = 2
  max_size = 3
  desired_capacity = 2
  # Causing cylic dependency
  # target_group_arns = [data.aws_lb_target_group.tg.arn]
  
  launch_template {
    id = aws_launch_template.frontend-ec2.id
    version = "$Latest"
  }
}
resource "null_resource" "force_asg_before_listener" {
    depends_on = [aws_autoscaling_group.asg-frontend]
}
// Launch Template for Backend

resource "aws_launch_template" "backend-ec2" {
  name_prefix = "backend-ec2"
  instance_type = var.instance_type
  image_id = var.ami
  vpc_security_group_ids = [var.backend_sg]
  key_name = var.key_name
  // Node App Front-end
  user_data = filebase64("backend.sh")

  tags = {
    Name = "Backend EC2 Instance"
  }

}


resource "aws_autoscaling_group" "asg-backend" {
  name = "asg-backend"
  vpc_zone_identifier = var.private_subnets
  min_size = 2
  max_size = 3
  desired_capacity = 2
  
  launch_template {
    id = aws_launch_template.backend-ec2.id
    version = "$Latest"
  }
}

// Autoscaling for frontend to loadbalancer
resource "aws_autoscaling_attachment" "asg-attach" {
  autoscaling_group_name = aws_autoscaling_group.asg-frontend.id
  lb_target_group_arn = var.lb_tg
}
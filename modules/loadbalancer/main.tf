provider "random" {}

resource "random_string" "unique" {
  length  = 8
  special = false
}

resource "aws_lb" "main-alb" {
  name = "application-lb"
  security_groups = [var.lb_sg]
  subnets = var.public_subnets
  internal = false
  load_balancer_type = "application"
  idle_timeout = 400
  depends_on = [ 
    var.asg-frontend
   ]
}

resource "aws_lb_target_group" "tg" {
  name = "lb-tg-${random_string.unique.result}"
  port = var.tg_port
  protocol = var.tg_protocol
  vpc_id = var.vpc_id

  lifecycle {
    ignore_changes = [ name ]
    create_before_destroy = true
  }

}

resource "aws_lb_listener" "lb_listener" {
  load_balancer_arn = aws_lb.main-alb.arn
  port = var.listener_port
  protocol = var.listener_protocol

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.tg.arn
  }
}

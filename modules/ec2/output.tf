output "asg-frontend" {
    value = aws_autoscaling_group.asg-frontend
}

output "backend-asg" {
  value = aws_autoscaling_group.asg-backend
}
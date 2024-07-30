output "asg-frontend" {
    value = aws_autoscaling_group.asg-frontend
}

output "asg-backend" {
  value = aws_autoscaling_group.asg-backend
}

output "signed_url" {
  value = trimspace(data.local_file.signed_url_file.content)
}
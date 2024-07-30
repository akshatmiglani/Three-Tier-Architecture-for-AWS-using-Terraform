output "alb-endpoint" {
  value = aws_lb.main-alb.dns_name
}

output "internal-lb-endpoint" {
  value = aws_lb.internal-alb.dns_name
}
output "lb_tgname" {
  value = aws_lb_target_group.tg.name
}
output "lb_tg" {
  value = aws_lb_target_group.tg.arn
}
output "private_tg" {
  value = aws_lb_target_group.private_tg.arn
}
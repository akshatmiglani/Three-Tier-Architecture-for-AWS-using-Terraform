output "vpc_id" {
  value = aws_vpc.mainvpc.id
}

output "db_sg_name" {
  value = aws_db_subnet_group.db_subnet.*.name
}

output "db_sg_id" {
  value = aws_db_subnet_group.db_subnet.*.id
}
output "rds_sg"{
    value = aws_security_group.rds_sg.id
}
output "frontend_sg"{
    value = aws_security_group.frontend.id
}
output "backend_sg" {
    value = aws_security_group.backend.id
}
output "bastion_sg"{
    value = aws_security_group.bastion.id
}
output "lb_sg"{
    value = aws_security_group.loadbalancersg.id
}
output "public_sub"{
    value = aws_subnet.public_subnet.*.id
}
output "public_sub"{
    value = aws_subnet.private_subnet.*.id
}
output "public_sub"{
    value = aws_subnet.private_db.*.id
}
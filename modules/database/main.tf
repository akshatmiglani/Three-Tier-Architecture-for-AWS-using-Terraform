resource "aws_db_instance" "mysql_db" {
  allocated_storage = var.db_storage
  engine = "mysql"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class
  db_name = var.db_name
  username = var.db_user
  password = var.dbpassword
  db_subnet_group_name = var.db_subnet_group_name
  identifier = var.db_identifer
  skip_final_snapshot = true
  vpc_security_group_ids = [var.rds_sg]
}
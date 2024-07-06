provider "aws" {
  region = "ap-south-1"
}

module "vpc-subnet-setup" {
  source = "./modules/vpc-subnet-setup"
  cidr_block = "10.0.0.0/16"
  access_ip = var.access_ip
  num_subnet = 2
  db_sg = true
  availability_zone = "ap-south-1a"
  availability_zones = 2
}

module "ec2" {
  source = "./modules/ec2"
  frontend_sg = module.vpc-subnet-setup.frontend_sg
  backend_sg = module.vpc-subnet-setup.backend_sg
  bastion_sg = module.vpc-subnet-setup.bastion_sg
  public_subnets = module.vpc-subnet-setup.public_sub
  private_subnets = module.vpc-subnet-setup.private_sub
  bastion-count = 1
  instance_type = "t2.micro"
  key_name = "PROJECT-KEY"
  ssh_key = "PROJECT-KEY"
  tg_name =  module.loadbalancing.lb_tgname
  lb_tg = module.loadbalancing.lb_tg
  ami = var.ami
}

module "database" {
  source = "./modules/database"
  db_storage = 10
  db_engine_version = "8.0.35"
  db_instance_class = "db.t3.micro"
  db_name = var.db_name
  db_user = var.db_user
  dbpassword = var.db_password
  db_identifer = "projectdb"
  rds_sg = module.vpc-subnet-setup.rds_sg
  db_subnet_group_name = module.vpc-subnet-setup.db_sg_name[0]
}


module "loadbalancing" {
  source = "./modules/loadbalancer"
  lb_sg = module.vpc-subnet-setup.lb_sg
  public_subnets = module.vpc-subnet-setup.public_sub
  tg_port = 80
  tg_protocol = "HTTP"
  vpc_id = module.vpc-subnet-setup.vpc_id
  asg-frontend = module.ec2.asg-frontend
  listener_port = 80
  listener_protocol = "HTTP"
  availability_zones = 2
}

provider "aws" {
  region = "ap-south-1"
}

module "ec2" {
  source = "./modules/ec2"
  ami_value = "ami-0e1d06225679bc1c5"
  instance_type_value = "t2.micro"
}

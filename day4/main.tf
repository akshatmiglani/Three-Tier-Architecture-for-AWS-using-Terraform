provider "aws" {
  region = "ap-south-1"
}

variable "ami" {
  description = "value"
}

variable "instance_type" {
  description = "value"
}

module "ec2"{
    source = "./modules/ec2"
    ami = var.ami
    instance_type = var.instance_type
}
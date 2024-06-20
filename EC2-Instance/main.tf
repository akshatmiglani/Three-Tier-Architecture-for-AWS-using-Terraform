provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "test" {
  ami           = "ami-0f58b397bc5c1f2e8"
  instance_type = "t2.micro"
  key_name      = "Akshat123"
  subnet_id     = "subnet-0bf65d774f4c567d3"  
  
  tags = {
    Name = "test instance"
  }
}

# Creating VPC firstly

resource "aws_vpc" "myvpc" {
  cidr_block = var.cidr
}

resource "aws_subnet" "sub1" {
  vpc_id = aws_vpc.myvpc.id
  cidr_block = "10.0.0.0/24"
  availability_zone = "ap-south-1a"
  map_public_ip_on_launch = true

}


resource "aws_subnet" "sub2" {
  vpc_id = aws_vpc.myvpc.id
  cidr_block = "10.0.0.0/24"
  availability_zone = "ap-south-1a"
  map_public_ip_on_launch = true
  
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.myvpc.id

}
#  route table contains a set of rules, called routes, that determine where network traffic from your subnet or gateway is directed.
resource "aws_route_table" "RT" {
  vpc_id = aws_vpc.myvpc.id
  route  {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

}

# Attaching it to subnets

resource "aws_route_table_association" "rta1" {
  subnet_id = aws_subnet.sub1.id
  route_table_id = aws_route_table.RT.id

}
resource "aws_route_table_association" "rta2" {
  subnet_id = aws_subnet.sub1.id
  route_table_id = aws_route_table.RT.id
}


resource "aws_security_group" "securitygroup1" {
  name = "websg"
  vpc_id = aws_vpc.myvpc.id
  ingress {
    description = "HTTP"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "SSH"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 80
    to_port = 80
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_s3_bucket" "example" {
  bucket = "akshat-demo-proj"

}
# resource "aws_s3_bucket_public_access_block" "example" {
#   bucket = aws_s3_bucket.example.id
#   block_public_acls = false
#   block_public_policy = false
#   ignore_public_acls = false
#   restrict_public_buckets = false
# }
# resource "aws_s3_bucket_acl" "example" {
#    bucket = aws_s3_bucket.example.id
#    acl = "public-read"
# }

resource "aws_instance" "webserver1" {
    ami="ami-0e1d06225679bc1c5"
    instance_type = "t2.micro"
    vpc_security_group_ids = [aws_security_group.securitygroup1.id]
    subnet_id = aws_subnet.sub1.id
    user_data = base64encode((file("userdata.sh")))
}

resource "aws_instance" "webserver2" {
    ami="ami-0e1d06225679bc1c5"
    instance_type = "t2.micro"
    vpc_security_group_ids = [aws_security_group.securitygroup1.id]
    subnet_id = aws_subnet.sub2.id
    user_data = base64encode((file("userdata1.sh")))
}

#Creating ALB

resource "aws_lb" "myalb" {
  name = "myalb"
  internal = false
  load_balancer_type = "application"
  security_groups = [aws_security_group.securitygroup1.id]
  subnets = [aws_subnet.sub1.id,aws_subnet.sub2.id]

}
resource "aws_lb_target_group" "tg" {
    name = "tg-1"
    port = 80
    protocol = "HTTP"
    vpc_id = aws_vpc.myvpc.id

    health_check {
      path = "/"
      port = "traffic-port"

    }
    tags = {
      Name="web"
    }
}

resource "aws_lb_target_group_attachment" "attach1" {
  target_group_arn = aws_lb_target_group.tg.arn
  target_id = aws_instance.webserver1.id
  port = 80
}

resource "aws_lb_target_group_attachment" "attach2" {
  target_group_arn = aws_lb_target_group.tg.arn
  target_id = aws_instance.webserver2.id
  port = 80
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.myalb.arn
  port = 80
  protocol = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.tg.arn
    type = "forward"
  }

}

output "loadbalancerdns" {
  value = aws_lb.myalb.dns_name

}
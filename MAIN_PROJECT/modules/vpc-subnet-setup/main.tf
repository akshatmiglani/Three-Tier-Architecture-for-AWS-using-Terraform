// VPC
resource "aws_vpc" "mainvpc" {
  cidr_block = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support = true

  tags ={
    Name="Three Tier VPC"
  }
  lifecycle {
    create_before_destroy = true
  }
}
// cidr_block (required): This property defines the primary CIDR block (Classless Inter-Domain Routing) for your VPC. A CIDR block specifies a range of IP addresses that can be allocated to resources within your VPC. 
//enable_dns_hostnames (optional): This property controls whether DNS hostnames are enabled for your VPC. When set to true (the default), Amazon VPC will resolve private IP addresses within the VPC to hostnames using a DNS server that it manages
//enable_dns_support (optional): This property determines whether DNS resolution is enabled for your VPC. When set to true (the default), Amazon VPC will provide a DNS server that can be used by instances in your VPC to resolve public DNS names (e.g., google.com).
//lifecycle (optional): This block can be used to manage the lifecycle of your VPC resource. The create_before_destroy property ensures that any resources that depend on the VPC (e.g., subnets, internet gateways) are created before the VPC itself is destroyed. 


data "aws_availability_zones" "available" { }


// Internet Gateway

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.mainvpc.id
  tags = {
    Name = "IGW"
  }
  lifecycle {
    create_before_destroy = true
  }
}

// Subnets

// Public Subnet for front-end
resource "aws_subnet" "public_subnet" {
  count = var.num_subnet
  vpc_id = aws_vpc.mainvpc.id
  cidr_block = "10.0.${count.index}.0/24"
  map_public_ip_on_launch = true
  availability_zone = data.aws_availability_zones.available.names[count.index]  

  tags = {
    Name = "Public_Subnet${count.index+1}"
  }
}

// Route Table Association

resource "aws_route_table" "rta1" {
  vpc_id = aws_vpc.mainvpc.id

  tags = {
    Name = "Public_Subnet"
  }
}

resource "aws_route" "default" {
  route_table_id         = aws_route_table.rta1.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.igw.id
}


resource "aws_route_table_association" "public_association" {
    count=var.num_subnet
    subnet_id = aws_subnet.public_subnet.*.id[count.index]
    route_table_id = aws_route_table.rta1.id
}


resource "aws_eip" "elastic_ip" {
  vpc = true
}

// NAT Gateway
// It is used such that instances in private subnet can connect to services outside your VPC
resource "aws_nat_gateway" "ngw" {
  allocation_id     = aws_eip.elastic_ip.id
  subnet_id         = aws_subnet.public_subnet[1].id
}


// Private Subnets
resource "aws_subnet" "private_subnet" {
  count = var.num_subnet
  vpc_id = aws_vpc.mainvpc.id
  cidr_block = "10.0.${30+count.index}.0/24"
  map_public_ip_on_launch = false
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name="Private_Subnet${count.index+1}"
  }
}

resource "aws_route_table" "rta2" {
  vpc_id = aws_vpc.mainvpc.id
  tags = {
    Name = "Private_Subnet"
  }
}

resource "aws_route" "default_private" {
  route_table_id = aws_route_table.rta2.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.ngw.id
}

resource "aws_route_table_association" "private_association" {
    count=var.num_subnet
    subnet_id = aws_subnet.private_subnet.*.id[count.index]
    route_table_id = aws_route_table.rta2.id
}

resource "aws_subnet" "private_db" {
  count = var.num_subnet
  vpc_id = aws_vpc.mainvpc.id
  cidr_block = "10.0.${50+count.index}.0/24"
  map_public_ip_on_launch = false
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags={
    Name="DB_Subnet${count.index+1}"
  }

}

// Security Groups

// it is for ssh into compute instances in private subnet
resource "aws_security_group" "bastion" {
  name = "bastion_sg"
  description = "For bastion"
  vpc_id = aws_vpc.mainvpc.id

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = [var.access_ip]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "loadbalancersg" {
  name = "lb_sg"
  description = "Inbound HTTP Traffic"
  vpc_id = aws_vpc.mainvpc.id

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
}

resource "aws_security_group" "frontend" {
  name = "frontend_sg"
  description = "Inbound HTTP Traffic from loadbalancer and bastion ssh allowed"
  vpc_id = aws_vpc.mainvpc.id

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
     security_groups = [aws_security_group.loadbalancersg.id]
  }
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
     security_groups = [aws_security_group.bastion.id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
}

resource "aws_security_group" "backend" {
  name = "backend_sg"
  description = "Inbound HTTP Traffic from frontend and bastion ssh"
  vpc_id = aws_vpc.mainvpc.id

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = [aws_security_group.frontend.id]
  }
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = [aws_security_group.bastion.id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
}

resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  description = "MYSQL PORT"
  vpc_id      = aws_vpc.mainvpc.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// Database
resource "aws_db_subnet_group" "db_subnet" {
  count      = var.db_sg == true ? 1 : 0
  name       = "rds_subnet"
  subnet_ids = [aws_subnet.private_db[0].id, aws_subnet.private_db[1].id]

  tags = {
    Name = "database subnet "
  }
}


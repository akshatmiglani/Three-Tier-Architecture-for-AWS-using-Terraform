variable "cidr_block" {
  type = string
}

variable "num_subnet" {
  type = number
}

variable "access_ip" {
  type = string
}

variable "db_sg" {
  type = bool
}

variable "availability_zone" {}
variable "availability_zones" {}
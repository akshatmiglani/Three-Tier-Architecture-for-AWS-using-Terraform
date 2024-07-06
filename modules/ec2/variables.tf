variable "backend_sg" {}
variable "frontend_sg" {
  
}
variable "bastion_sg" {
  
}
variable "private_subnets" {
  
}
variable "public_subnets" {
  
}
variable "key_name" {
  
}
variable "lb_tg" {
  
}
variable "tg_name" {
  
}

variable "ssh_key" {
  type = string
}
variable "bastion-count" {
  type = number
}
variable "instance_type" {
  type = string
}
variable "ami" {
  type = string
}
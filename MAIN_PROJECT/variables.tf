variable "access_ip" {
  type = string
}
variable "db_name" {
  type = string
}
variable "db_user" {
  type = string
  sensitive = true
}
variable "db_password" {
  type = string
  sensitive = true
}

variable "ssh_key" {
    type = string
}
variable "ami" {
  default = "ami-0ad21ae1d0696ad58"
}
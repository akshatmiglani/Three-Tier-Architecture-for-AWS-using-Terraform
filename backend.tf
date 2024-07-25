terraform {
  backend "s3" {
    bucket = "akshatm-remote-backend-1"
    key = "State-Files/terraform.tfstate"
    region = "ap-south-1"
  }
}
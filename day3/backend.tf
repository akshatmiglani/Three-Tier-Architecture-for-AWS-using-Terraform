terraform {
  backend "s3" {
    region = "ap-south-1"
    bucket = "akshatmiglani-s3-remote-backend"
    key = "akshat/terraform.tfstate"
  }
}

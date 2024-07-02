terraform {
  backend "s3" {
    bucket = "akshatmiglani-remote-backend"
    key = "State-Files/terraform.tfstate"
    region = "ap-south-1"
  }
}
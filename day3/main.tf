provider "aws" {
    region="ap-south-1"
}
resource "aws_instance" "example_test" {
    instance_type = "t2.micro"
    ami="ami-0e1d06225679bc1c5"
}
resource "aws_s3_bucket" "s3_bucket" {
  bucket="akshatmiglani-s3-remote-backend"
}
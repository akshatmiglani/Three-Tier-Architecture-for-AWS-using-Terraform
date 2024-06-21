# Terraform-Learning
Day-1

## Infrastructure as Code
Eg. S3 bucket for 100 teams, manually will take around 100 mins.
We can use programatic skills like AWS CLI, or API to create this.

Eg. What if VPC config + EC2 instance + S3 as endpoint, 
Cloud Providers provide CFTS(Cloud Formation Templates), JSON or YAML

This is Infrastructure as Code.

AWS-> CFT
Azure-> Resource Managers

OpenStack -> Heat Templates

## Terraform for a cloud engineer
You may have to deal with differnt tools like AWS,Azure,OpenStack,GCP.
Terraform provides a uniform approach, and tell where automation is required.
HashiCorp Language (HCL)

Competitors : Pulumi, Crossplane,
API as Code
Huge community.

## Github CodeSpaces
devcontainer-> terraform+aws and rebuild container

## Setting up Terraform for AWS
aws cli install
aws configure
Access ID
Secret Key ID

## Writing Your First Terraform Code
Creating an EC2 Instance in EC2-Instance/main.tf
```bash
provider "aws" {
    region="ap-south-1"
}

resource "ec2" "test"   {
    ami = "ami-0f58b397bc5c1f2e8"
    instance_type="t2.micro"
}
```

# Commands
TERRAFORM Commands
terraform init-> Initalizer provider plugins

terraform plan-> What terraform will perform
terraform apply -> Create the instance

EC2 Instance is created.

# State File
Terraform state file - to record whatever infrastructure is created.

Terraform Destroy!


	
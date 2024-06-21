## Providers
Provider is a plugin which helps terraform to understand where the project is to be created.
Official, Provider, Community

Most common way for configuration -> root module
In Child Module
You can also configure providers in the required_providers block. This is useful if you want to make sure that a specific provider version is used.


 If you are only using a single provider, then configuring it in the root module is the simplest option. If you are using multiple providers, or if you want to reuse the same provider configuration in multiple resources, then configuring it in a child module is a good option. And if you want to make sure that a specific provider version is used, then configuring it in the required_providers block is the best option.


## Multiple Providers
For hybrid cloud!
providers.tf
```bash
resource "aws_instance" "example" {
  ami = "ami-0123456789abcdef0"
  instance_type = "t2.micro"
}

resource "azurerm_virtual_machine" "example" {
  name = "example-vm"
  location = "eastus"
  size = "Standard_A1"
}
```

## Multiple Regions
use alias 

provider "aws" {
  alias = "us-east-1"
  region = "us-east-1"
}

## Variables
To avoid hard-coding the paramters for launching the instances.
Input Variable, Output variable, print the public IP back.
```bash
variable "example_var" {
  description = "An example input variable"
  type        = string
  default     = "default_value"
}

resource "example_resource" "example" {
  name = var.example_var
}
output "public_ip" {
  description = "Public IP address for the EC2 instance"
  value       = aws_instance.test.public_ip

}
```
It is possible to pass variables from terraform apply as well, or from another file too.

## Diiferent Modules
Provider.tf
Input.tf
output.tf
main.tf

terraform.tfvars
-> How to parameterize completely!!
In Terraform, .tfvars files (typically with a .tfvars extension) are used to set specific values for input variables defined in your Terraform configuration.

They allow you to separate configuration values from your Terraform code, making it easier to manage different configurations for different environments (e.g., development, staging, production) or to store sensitive information without exposing it in your code.

Example terraform apply -var-file=dev.tfvars


## Conditional Expressions

Conditional expressions in Terraform are used to define conditional logic within your configurations. They allow you to make decisions or set values based on conditions. Conditional expressions are typically used to control whether resources are created or configured based on the evaluation of a condition.

## Built-In Functions

concat(list1, list2, ...)
element(list, index)
length(list)    
map(key, value)
lookup(map, key)
join(separator, list)


## Modules
Real life example, organization - millions of lines of soruce code, micro-service architecture (all 1million lines of code written as one single application)

Who owns which line of code, 1000 functions.
Difficult to maintain
Testing difficult.

Micro-service architecture.

One development team
VPC, EC2, LB, EKS, LAMBDA, S3 etc.

## Benefits
    1. Modualrity
    2. Resuability
    3. Simplified Collaboration
    4. Versioning and Maintenance
    5. Abstraction
    6. Testing & Validation
    7. Documentaion
    8. Scalability
    9. Security and Compliance\

```bash
provider "aws" {
  region = "ap-south-1"
}

module "ec2" {
  source = "./modules/ec2"
  ami_value = "ami-0e1d06225679bc1c5"
  instance_type_value = "t2.micro"
}
```



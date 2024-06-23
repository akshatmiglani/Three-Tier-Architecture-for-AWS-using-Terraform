## Terraform Workspaces
![alt text](image.png)

For different stages like dev,production, pre-prod etc.

dev.tfvars, stage.tfvars, prod tfvars

donot want to create different folders for them.

Workspaces-> maintain statefile per environment


# terraform workspace new dev

3 ways to handle the tfvars file
1. create three files like stage.tfvars, dev.tfvars, and more


2. or other is creating a map(string)

```bash 
variable "instance_type" {
    description="value"
    type=map(string)

    default = {
        "dev" = "t2.micro"
        "stage" = "t2.medium"
        "prod" = "t2.xlarge"
    }
}
```


# instance_type=lookup(instance_type,terraform.workspace,"t2.micro")




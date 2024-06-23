provider "aws" {
  region= "ap-south-1"
}

provider "vault" {
  address = "http://13.201.27.19:8200"
  skip_child_token = true

  auth_login {
    path = "auth/approle/login"

    parameters = {
      role_id = "82c5e478-6662-05a3-fe4d-c6d988a8a929"
      secret_id = "dbd56236-22df-667c-e281-8406862810bc"
    }
  }
}


data "vault_kv_secret_v2" "example" {
  mount = "kv" 
  name  = "test_secret" 
}

resource "aws_instance" "example"{
    ami = "ami-0e1d06225679bc1c5"
    instance_type = "t2.micro"

    tags={
        Name="test"
        Secret=data.vault_kv_secret_v2.example.data["akshat"]
    }
}

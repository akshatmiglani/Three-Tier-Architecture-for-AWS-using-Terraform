pipeline {
    agent any

    parameters {
        choice(name: 'action', choices: ['apply', 'destroy'], description: 'Select the Terraform action to perform')
        string(name: 'AWS_ACCESS_KEY_ID', defaultValue: '', description: 'AWS Access Key ID')
        string(name: 'AWS_SECRET_ACCESS_KEY', defaultValue: '', description: 'AWS Secret Access Key')
        string(name: 'EMAIL', defaultValue: '', description: 'Email address to send notifications')
    }

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCESS_KEY_ID = "${params.AWS_ACCESS_KEY_ID}"
        AWS_SECRET_ACCESS_KEY = "${params.AWS_SECRET_ACCESS_KEY}"
        S3_BUCKET = "automationapp-terraform"
        API_URL=credentials('api-endpoint')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'InfraFor3TierArchitecture', url: 'https://github.com/akshatmiglani/Three-Tier-Architecture-for-AWS-using-Terraform'
                sh 'chmod +x modules/ec2/generate_signed_url.sh'
                
            }
        }
        stage('Check AWS Credentials') {
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
                    sh 'aws sts get-caller-identity'
                }
            }
        }
        stage('Check/Create S3 Bucket') {
            steps {
                script {
                    def bucketExists = sh(script: "aws s3api head-bucket --bucket ${S3_BUCKET} 2>/dev/null", returnStatus: true) == 0
                    if (!bucketExists) {
                        sh "aws s3api create-bucket --bucket ${S3_BUCKET} --region ${AWS_REGION} --create-bucket-configuration LocationConstraint=${AWS_REGION}"
                    }
                }
            }
        }
        stage('Terraform init') {
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
                    writeFile file: 'backend.tf', text: """
                    terraform {
                      backend "s3" {
                        bucket = "${S3_BUCKET}"
                        key    = "terraform/state"
                        region = "${AWS_REGION}"
                      }
                    }
                    """
                    sh 'terraform init -reconfigure'
                }
            }
        }
        stage('Plan') {
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
                    sh 'terraform plan'
                }
            }
        }
        stage('Terraform Action') {
            when {
                expression { params.action == 'apply' || params.action == 'destroy' }
            }
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
                    sh "terraform ${params.action} --auto-approve"
                }
            }
        }
        stage('Capture Terraform Output') {
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
                    script {
                        def output = sh(script: 'terraform output -json', returnStdout: true).trim()
                        writeFile file: 'terraform_output.json', text: output
                    }
                }
            }
        }
        stage('Send Email') {
            steps {
                script {
                    def subject = ""
                    def body = ""
                    def attachments = ""

                    if (params.action == 'apply') {
                        subject = "Terraform Output from Jenkins Pipeline"
                        body = "Please find the attached Terraform output."
                        attachments = 'terraform_output.json'
                    } else if (params.action == 'destroy') {
                        subject = "Terraform Configuration Destroyed"
                        body = "The Terraform configuration has been destroyed. No output file is attached."
                        attachments = ''
                    }

                    emailext(
                        to: "${params.EMAIL}",
                        subject: subject,
                        body: body,
                        attachmentsPattern: attachments
                    )
                }
            } 
        }
    }
    post {
        success {
            script {
                def email = "${params.EMAIL}"
                def payload
    
                if (params.action == "destroy") {
                    payload = """
                    {
                        "email": "${email}",
                        "action": "destroy"
                    }
                    """
                } else {
                    def filePath = 'terraform_output.json'
                    if (!fileExists(filePath)) {
                        error 'File terraform_output.json does not exist.'
                    }
    
                    def terraformOutput = readFile(filePath).trim()
    
                    payload = """
                    {
                        "email": "${email}",
                        "action": "active",
                        "terraformOutput": ${terraformOutput}
                    }
                    """
                }
    
                // Use the payload directly with curl, escaping the payload properly
                def response = sh(script: """curl -v -s -X POST ${API_URL}/updateConfig -H "Content-Type: application/json" -d '${payload}'""", returnStdout: true)

                // Output response from API
                echo "Response from API: ${response}"
            }
        }
    
        failure {
            echo 'Build failed. Skipping database update.'
        }
        unstable {
            echo 'Build is unstable. Skipping database update.'
        }
    }

}

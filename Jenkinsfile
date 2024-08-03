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
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'InfraFor3TierArchitecture', url: 'https://github.com/akshatmiglani/Three-Tier-Architecture-for-AWS-using-Terraform'
            }
        }
        stage('Check AWS Credentials') {
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
                    sh 'aws sts get-caller-identity'
                }
            }
        }
        stage('Terraform init') {
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}", "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"]) {
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
        always {
            script {
                def email = "${params.EMAIL}"
                def mongoScript = """
                const { MongoClient } = require('mongodb');
                const fs = require('fs');

                async function main() {
                    const uri = 'mongodb://localhost:27017';
                    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                    try {
                        await client.connect();
                        const database = client.db('myDatabase');
                        const collection = database.collection('users');

                        const fileContent = fs.readFileSync('terraform_output.json', 'utf8');
                        const terraformOutput = JSON.parse(fileContent);

                        const result = await collection.updateOne(
                            { email: email },
                            { 
                                $set: {
                                    frontendLoadBalancer: terraformOutput.frontendLoadBalancer || 'N/A',
                                    backendLoadBalancer: terraformOutput.backendLoadBalancer || 'N/A',
                                    databaseEndpoint: terraformOutput.databaseEndpoint || 'N/A',
                                    signedUrlForPemFile: terraformOutput.signedUrlForPemFile || 'N/A'
                                } 
                            },
                            { upsert: true }
                        );

                        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
                    } finally {
                        await client.close();
                    }
                }

                main().catch(console.error);
                """
                writeFile file: 'storeMongoDB.js', text: mongoScript
                sh 'node storeMongoDB.js'
            }
        }
    }
}

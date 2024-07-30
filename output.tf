output "loadbalancer-endpoint" {
    value = module.loadbalancing.alb-endpoint
}

output "backend-endpoint" {
    value = module.loadbalancing.internal-lb-endpoint
}

output "database-endpoint" {
  value = module.database.endpoint
}

output "signed_url" {
  value = module.ec2.signed_url
}
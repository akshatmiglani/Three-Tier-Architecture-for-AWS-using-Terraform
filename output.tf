output "loadbalancer-endpoint" {
    value = module.loadbalancing.alb-endpoint
}

output "database-endpoint" {
  value = module.database.endpoint
}

output "signed_url" {
  value = module.ec2.signed_url
}
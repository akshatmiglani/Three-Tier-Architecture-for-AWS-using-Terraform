output "loadbalancer-endpoint" {
    value = module.loadbalancing.alb-endpoint
}

output "database-endpoint" {
  value = module.database.endpoint
}

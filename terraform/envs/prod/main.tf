terraform {
  backend "azurerm" {}
}

module "platform" {
  source = "../../"

  location                     = var.location
  resource_group_name          = var.resource_group_name
  vnet_name                    = var.vnet_name
  vnet_address_space           = var.vnet_address_space
  subnet_name                  = var.subnet_name
  subnet_prefixes              = var.subnet_prefixes
  aks_name                     = var.aks_name
  dns_prefix                   = var.dns_prefix
  node_count                   = var.node_count
  min_count                    = var.min_count
  max_count                    = var.max_count
  vm_size                      = var.vm_size
  acr_name                     = var.acr_name
  log_analytics_workspace_name = var.log_analytics_workspace_name
}

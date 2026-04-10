variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "vnet_name" {
  description = "Virtual network name"
  type        = string
  default     = "vnet-devops-demo"
}

variable "vnet_address_space" {
  description = "VNet address range"
  type        = list(string)
  default     = ["10.10.0.0/16"]
}

variable "subnet_name" {
  description = "Subnet name"
  type        = string
  default     = "aks-subnet"
}

variable "subnet_prefixes" {
  description = "Subnet CIDR"
  type        = list(string)
  default     = ["10.10.1.0/24"]
}

variable "aks_name" {
  description = "AKS cluster name"
  type        = string
}

variable "dns_prefix" {
  description = "AKS DNS prefix"
  type        = string
}

variable "node_count" {
  description = "Initial node count"
  type        = number
  default     = 2
}

variable "min_count" {
  description = "Minimum autoscaler nodes"
  type        = number
  default     = 2
}

variable "max_count" {
  description = "Maximum autoscaler nodes"
  type        = number
  default     = 4
}

variable "vm_size" {
  description = "AKS node VM size"
  type        = string
  default     = "Standard_B2s"
}

variable "acr_name" {
  description = "Azure Container Registry name"
  type        = string
}

variable "log_analytics_workspace_name" {
  description = "Log Analytics workspace for AKS monitoring"
  type        = string
}

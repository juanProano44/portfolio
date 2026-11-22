variable "domain_name" {
  description = "Primary domain name for the portfolio"
  type        = string
  default     = "jupdev44.dev"
}

variable "github_org" {
  description = "GitHub organization or user"
  type        = string
  default     = "jupdev44"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "portfolio"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "portfolio"
    ManagedBy   = "terraform"
    Environment = "production"
  }
}

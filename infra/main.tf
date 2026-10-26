terraform {
  required_version = ">= 1.5"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.18.0"
    }
    render = {
      source  = "render-oss/render"
      version = "1.9.1"
    }
  }
}

provider "neon" {}
provider "render" {}

# --- PROYECTO NEON ---
resource "neon_project" "preprod" {
  name                      = "tp01-preprod"
  history_retention_seconds = 21600
  org_id = "org-orange-sound-72442535"
}

resource "neon_role" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "app_preprod_owner"
}

resource "neon_database" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "app_preprod"
  owner_name = neon_role.preprod.name
}

locals {
  # Cadena de conexión armada dinámicamente para FastAPI/SQLAlchemy
  conn = "postgresql://${neon_role.preprod.name}:${neon_role.preprod.password}@${neon_project.preprod.database_host}/${neon_database.preprod.name}?sslmode=require"
}

# --- SERVICIOS RENDER ---
resource "render_web_service" "api" {
  name   = "tp01-api-preprod"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = var.image_repo_api
      tag       = var.image_tag
    }
  }

  env_vars = {
    DATABASE_URL = { value = local.conn }
  }
}

resource "render_web_service" "front" {
  name   = "tp01-front-preprod"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = var.image_repo_front
      tag       = var.image_tag
    }
  }

  env_vars = {
    URL_API      = { value = render_web_service.api.url }
    BACKEND_URL  = { value = render_web_service.api.url }
    DNS_RESOLVER = { value = "8.8.8.8" }
  }
}
# Production-Level Upgrade Notes (Student Friendly)

This document explains the Terraform, Kubernetes, and CI/CD upgrades done for a full-marks 6th semester DevOps project.

## 1) Terraform Improvements

### Objective
Make infrastructure reusable, environment-aware, and safe for team collaboration.

### What was added
- Remote state bootstrap: `terraform/bootstrap/main.tf`
  - Creates Azure Resource Group, Storage Account, and Blob container for Terraform state.
- Environment folders:
  - `terraform/envs/dev`
  - `terraform/envs/prod`
- Backend config examples:
  - `terraform/envs/dev/backend.hcl.example`
  - `terraform/envs/prod/backend.hcl.example`
- Autoscaling in AKS:
  - `enable_auto_scaling`, `min_count`, `max_count`
- Monitoring:
  - Log Analytics Workspace + AKS `oms_agent`

### Why this is production-level
- Shared remote state avoids local-state conflicts.
- Azure Blob backend supports lease-based state locking.
- Separate `dev` and `prod` variables prevent accidental misconfiguration.
- Autoscaler improves cost/performance balance.
- Azure Monitor gives basic observability.

### Commands

#### Step A: Create remote-state storage (one time)
```bash
cd terraform/bootstrap
terraform init
terraform apply -auto-approve
```

#### Step B: Deploy DEV infrastructure
```bash
cd ../envs/dev
cp backend.hcl.example backend.hcl
# edit backend.hcl using bootstrap outputs
terraform init -backend-config=backend.hcl
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars -auto-approve
```

#### Step C: Deploy PROD infrastructure
```bash
cd ../prod
cp backend.hcl.example backend.hcl
# edit backend.hcl using bootstrap outputs
terraform init -backend-config=backend.hcl
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars -auto-approve
```

### Expected output (sample)
```text
Apply complete! Resources: 12 added, 0 changed, 0 destroyed.
Outputs:
aks_cluster_name = "aks-devops-demo-dev"
acr_login_server = "devopsdemodevacr12345.azurecr.io"
log_analytics_workspace_name = "law-devops-demo-dev"
```

---

## 2) CI/CD Enhancements

### Objective
Use separate release flows for development and production with safer deployment behavior.

### What was added
- Updated workflow: `.github/workflows/cicd.yml`
- Separate deployment jobs:
  - `deploy-dev` (auto on `dev` branch)
  - `deploy-prod` (on `main` or `v*` tags, gated by `prod` environment approval)
- Dependency caching with `actions/setup-node` npm cache.
- Docker image tags:
  - `latest`
  - commit SHA
  - version tag (`v*` tag or fallback `v0.1.<run_number>`)
- Rollback:
  - `kubectl rollout undo` if deployment rollout fails.

### Environment protection concept
In GitHub repository settings:
1. Create environments `dev` and `prod`.
2. For `prod`, enable **Required reviewers**.
3. Production deployment waits for manual approval before running.

### Required secrets
- `AZURE_CREDENTIALS`
- `ACR_NAME`
- `ACR_LOGIN_SERVER`
- `AZURE_RG_DEV`, `AKS_CLUSTER_NAME_DEV`
- `AZURE_RG_PROD`, `AKS_CLUSTER_NAME_PROD`

### Expected pipeline log (sample)
```text
Build and Test
  - npm ci (backend/frontend) restored from cache
Build and Push Images
  - pushed backend:latest, backend:<sha>, backend:v1.0.0
Deploy to AKS Dev
  - rollout status deployment/backend-deployment successfully rolled out
Deploy to AKS Prod
  - waiting for environment approval...
  - approved by reviewer
  - rollout status deployment/frontend-deployment successfully rolled out
```

---

## 3) Kubernetes Improvements

### Objective
Increase reliability and safer updates.

### What was added
- New folders:
  - `k8s/dev`
  - `k8s/prod`
- Separate namespaces:
  - `dev` namespace file
  - `prod` namespace file
- Deployment hardening:
  - readiness probes
  - liveness probes
  - CPU/memory requests and limits
  - rolling update strategy (`maxUnavailable: 0`, `maxSurge: 1`)

### Commands

#### Deploy DEV manifests
```bash
kubectl apply -f k8s/dev/namespace.yaml
kubectl apply -f k8s/dev/
kubectl get pods -n dev
```

#### Deploy PROD manifests
```bash
kubectl apply -f k8s/prod/namespace.yaml
kubectl apply -f k8s/prod/
kubectl get pods -n prod
```

### Expected output (sample)
```text
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7f8c9f6f6f-2xw9j   1/1     Running   0          52s
frontend-deployment-68b97f7df-kq8vc   1/1     Running   0          49s
```

---

## 4) Report-Writing Summary

Use these points in your final report:
- Remote state + locking improved Terraform team safety.
- Environment separation (`dev/prod`) improved release discipline.
- AKS autoscaling + Azure Monitor improved reliability and observability.
- CI/CD introduced staged deployment with manual production approval.
- Rollback automation reduced deployment risk.
- Kubernetes probes and limits improved health management and stability.

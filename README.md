# Fully Automated CI/CD DevOps Pipeline Project

This project demonstrates an end-to-end DevOps setup for a simple full-stack application using:

- React frontend
- Node.js (Express) backend API
- MongoDB (via Docker Compose) with in-memory fallback
- Docker and Docker Compose
- Terraform (Azure Resource Group, VNet, AKS, ACR)
- Kubernetes manifests
- Ansible playbooks
- GitHub Actions CI/CD

---

## 1) Objective

Design and implement a complete CI/CD DevOps pipeline using containerization and Infrastructure as Code that is simple enough for a student project but realistic for production-style workflows.

---

## 2) Tools Used

- **Application**: React, Node.js, Express
- **Database**: MongoDB
- **Version Control**: Git, GitHub
- **Containerization**: Docker, Docker Compose
- **IaC**: Terraform (Azure provider)
- **Orchestration**: Kubernetes (AKS)
- **Config Management**: Ansible
- **CI/CD**: GitHub Actions
- **Registry**: Azure Container Registry (preferred) or Docker Hub

---

## 3) Repository Structure

```text
.
├── .github/workflows/
│   └── cicd.yml
├── ansible/
│   ├── inventory.ini
│   ├── playbook.yml
│   └── roles/
│       ├── docker_setup/tasks/main.yml
│       └── deploy_app/tasks/main.yml
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   ├── index.js
│   │   └── routes/auth.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── public/index.html
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
├── terraform/
│   ├── modules/
│   │   ├── network/
│   │   └── aks/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── docker-compose.yml
└── .gitignore
```

---

## 4) Application Phase

### Objective
Create a minimal full-stack app with login and home page.

### Steps
1. Backend exposes:
   - `GET /api/health`
   - `POST /api/login`
2. Frontend has:
   - Login form
   - Home page after successful login
3. Backend stores users in-memory (default demo user).

### Default Demo Credentials
- Username: `admin`
- Password: `admin123`

---

## 5) Version Control Strategy

### Branching Model
- `main`: production-ready code
- `dev`: integration branch for daily development
- feature branches: `feature/<name>` merged into `dev`
- release/hotfix branches can be added if needed

### Suggested Git Commands

```bash
git checkout -b dev
git checkout -b feature/frontend-login
git add .
git commit -m "add login flow and api"
git checkout dev
git merge feature/frontend-login
git checkout main
git merge dev
```

---

## 6) Containerization Phase

### Objective
Package frontend and backend as portable containers and run locally with Compose.

### Run Locally

```bash
docker compose up --build -d
docker compose ps
```

### Expected Output (Sample)

```text
[+] Building 34.2s (28/28) FINISHED
 => [backend 1/6] FROM node:20-alpine
 => [frontend build 1/6] FROM node:20-alpine
 => [frontend runtime 1/2] FROM nginx:stable-alpine
...
NAME               IMAGE                  STATUS
devproj-backend    devproj-backend:latest Up
devproj-frontend   devproj-frontend:latest Up
devproj-mongo      mongo:7                Up
```

---

## 7) Infrastructure as Code (Terraform on Azure)

### Objective
Provision reusable and modular infrastructure:
- Resource Group
- Virtual Network + Subnet
- Azure Container Registry (ACR)
- AKS Cluster

### Configure

1. Copy variable file:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   ```
2. Set values in `terraform.tfvars`.
3. Authenticate:
   ```bash
   az login
   az account set --subscription "<SUBSCRIPTION_ID>"
   ```

### Apply

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out tfplan
terraform apply tfplan
```

### Expected Output (Sample)

```text
Apply complete! Resources: 9 added, 0 changed, 0 destroyed.

Outputs:
aks_cluster_name = "aks-devops-demo"
acr_login_server = "devopsdemoacr.azurecr.io"
resource_group_name = "rg-devops-demo"
```

---

## 8) Kubernetes Deployment Phase

### Objective
Deploy frontend and backend workloads into AKS.

### Steps

```bash
az aks get-credentials --resource-group rg-devops-demo --name aks-devops-demo --overwrite-existing
kubectl apply -f k8s/
kubectl get pods -n default
kubectl get svc -n default
```

### Expected Output (Sample)

```text
NAME                                   READY   STATUS    RESTARTS   AGE
backend-deployment-6ff74f88c8-nl7k2    1/1     Running   0          38s
frontend-deployment-85f94d8bc4-r2t8s   1/1     Running   0          36s

NAME               TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)
backend-service    ClusterIP      10.0.144.12     <none>           5000/TCP
frontend-service   LoadBalancer   10.0.185.77     20.50.10.100     80:30391/TCP
```

---

## 9) Configuration Management (Ansible)

### Objective
Automate Docker installation, environment setup, and app deployment on Linux hosts.

### Run

```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

### Expected Output (Sample)

```text
PLAY [Prepare host and deploy app containers] ***************************

TASK [docker_setup : Install Docker dependencies] ***********************
ok: [target]
TASK [docker_setup : Install Docker engine] *****************************
changed: [target]
TASK [deploy_app : Run backend container] *******************************
changed: [target]
TASK [deploy_app : Run frontend container] ******************************
changed: [target]

PLAY RECAP **************************************************************
target : ok=11 changed=5 unreachable=0 failed=0
```

---

## 10) CI/CD Pipeline (GitHub Actions)

### Objective
Fully automate on push:
1. Build
2. Test
3. Build Docker images
4. Push images to ACR
5. Deploy to AKS

### Trigger
- Push to `main` or `dev`
- Pull request to `main`

### Required GitHub Secrets

- `AZURE_CREDENTIALS` (Service Principal JSON)
- `AZURE_RG`
- `AKS_CLUSTER_NAME`
- `ACR_NAME`
- `ACR_LOGIN_SERVER`

### Pipeline Logs (Sample)

```text
Run npm ci && npm test -- --watchAll=false
 PASS  src/App.test.js
Build and push backend image
The push refers to repository [devopsdemoacr.azurecr.io/backend]
latest: digest: sha256:abc123... size: 1995
Deploy manifests to AKS
deployment.apps/backend-deployment configured
deployment.apps/frontend-deployment configured
service/backend-service unchanged
service/frontend-service unchanged
```

---

## 11) Zero-Downtime and Scalability Concepts

- Kubernetes Deployments use **rolling updates** by default.
- `replicas` can be increased for horizontal scaling.
- Readiness probes ensure traffic is only sent to healthy pods.
- Service abstraction allows pod replacement without frontend interruption.
- Pipeline deploys declarative manifests to keep state consistent.

---

## 12) End-to-End Runbook

1. **Local Dev**
   - `docker compose up --build -d`
2. **Infra Provision**
   - `cd terraform && terraform init && terraform apply`
3. **Cluster Deploy**
   - `kubectl apply -f k8s/`
4. **Automation**
   - Push code to `dev`/`main` to trigger CI/CD

---

## 13) Best Practices Applied

- Modular Terraform (`modules/network`, `modules/aks`)
- Multi-stage Docker build for frontend
- Non-root friendly, small base images (`alpine`)
- Health endpoint and readiness probes
- Branch strategy for controlled promotion
- Infrastructure and deployment as code

---

## Notes

- For a classroom lab without Azure account, you can run local-only mode with Docker Compose.
- For real cloud execution, update Terraform variables and GitHub Actions secrets.
- For production-style upgrades (remote state, env split, autoscaling, monitoring, approvals, rollback), see `docs/production-upgrade.md`.

---

## Viewing CI/CD Output

1. Go to GitHub repository
2. Click on "Actions" tab
3. Select latest workflow run
4. Click any job (build/test/deploy)
5. View logs for each step

Viva line: "All pipeline stages are observable through GitHub Actions logs."

---

## Demo Steps

1. Run application:
   `docker-compose up`

2. Open frontend:
   `http://localhost:3000`

3. Login using:
   `username: admin`
   `password: admin`

4. Expected output:
   `"Welcome, Admin User"`

5. Check backend health:
   `http://localhost:5000/api/health`

Viva line: "We provide a structured demo flow for reproducibility."

---

## Troubleshooting Docker

- Ensure Docker Desktop is running
- Run: `docker info`
- Restart Docker if containers fail

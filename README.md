# ElderPing Application (Frontend + Microservices)

This repository contains all the application code, local developer configurations, database initialization scripts, and CI workflows for the ElderPing platform.

---

## Repository Structure

```text
elderping-app/
├── ai-service/             # Node.js AI assistant microservice
├── alert-service/          # Node.js Alert management microservice
├── appointment-service/    # Node.js Appointment microservice
├── audit-service/          # Node.js Audit logs microservice
├── auth-service/           # Node.js Auth microservice (Cognito integration)
├── finops-service/         # Node.js Budget & cost tracking microservice
├── health-service/         # Node.js Health vitals microservice
├── notes-service/          # Node.js Care notes microservice
├── notification-service/   # Node.js SNS/Email dispatch microservice
├── reminder-service/       # Node.js Medication reminder microservice
├── report-service/         # Node.js Patient reports microservice
├── frontend/               # React SPA (Vite + Tailwind CSS)
│
├── db-init/                # Local database seed SQL scripts
├── db-migrations/          # Database schema migrations
│
├── docker-compose.yaml     # Local Docker Compose development file
├── .env.example            # Environment variables example configuration
│
└── .github/
    └── workflows/          # GitHub Actions workflows for continuous integration
```

---

## Local Development Quick Start

### Prerequisites
* Docker and Docker Compose (v2+) installed locally.
* Node.js (v18+) for local code execution.

### 1. Configure local environments
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Ensure that the `DB_PASSWORD` and other environment secrets are configured.

### 2. Boot up Services
Run Docker Compose to build and start the 12 microservices and local databases:
```bash
docker compose up --build
```
This script automatically spins up PostgreSQL instances for the microservices. They will mount files inside `db-init/` to initialize local test databases.

### 3. Access the Frontend
The React SPA is exposed locally at:
* **Family Dashboard**: [http://localhost:8080](http://localhost:8080)

---

## Database Management
* **`db-init/`**: Contains baseline schemas used by the PostgreSQL Docker container entrypoint to set up databases locally.
* **`db-migrations/`**: Contains raw SQL DDL files representing step-by-step database changes. In staging and production, these can be ran by a migration runner or pipeline during deployment.

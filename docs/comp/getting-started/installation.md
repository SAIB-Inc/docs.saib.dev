---
title: Installation
sidebar_position: 2
---

# Installation

Set up the COMP service for running a metadata indexing and management system. This guide provides a step-by-step installation process. The installation covers everything from initial setup to verification, ensuring you have a fully functional metadata service. Follow each step in order to avoid configuration issues and ensure all dependencies are properly installed.

---

## Prerequisites

Ensure your environment meets these requirements. These components form the foundation for running the COMP service and must be installed before proceeding with the installation steps. Each requirement serves a specific purpose in the metadata management ecosystem:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| .NET SDK | 9.0+ | Core runtime for the service |
| PostgreSQL | 13.0+ | Database for metadata storage |
| Git | Latest | Source code management |

---

## Installation Steps

### 1. Clone the Repository

Download the COMP source code from the official GitHub repository. This creates a local copy of the project with all necessary files and documentation:

```bash
git clone https://github.com/SAIB-Inc/Cardano.Metadata.git
cd Cardano.Metadata
```

### 2. Set Up Database

Create and configure PostgreSQL database. This establishes a dedicated database for storing metadata with a secure user account that has full access permissions:

```sql
CREATE DATABASE cardano_metadata;
CREATE USER metadata_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cardano_metadata TO metadata_user;
```

### 3. Configure Environment

Set required environment variables for database connectivity and GitHub integration. These variables configure the service without hardcoding sensitive values in configuration files:

```bash
export ConnectionStrings__Metadata="Host=localhost;Database=cardano_metadata;Username=metadata_user;Password=your_password"
export Github__Token="your_github_personal_access_token"
```

### 4. Install Dependencies

Navigate to the source directory and restore all NuGet packages required by the project. This downloads and installs all necessary libraries and frameworks specified in the project file:

```bash
cd src/Cardano.Metadata
dotnet restore
```

### 5. Run Database Migrations

Apply Entity Framework migrations to create the required database schema. This command sets up all necessary tables, indexes, and relationships for the metadata service:

```bash
dotnet ef database update
```

### 6. Build and Run

Compile the application and start the COMP service. The build process validates all code and dependencies before launching the service on the configured ports:

```bash
dotnet build
dotnet run
```

The service will start on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

### 7. Verify Installation

Confirm the service is running correctly by testing the health and API endpoints. These commands validate that the installation was successful and the service is responding to requests:

```bash
# Check service health
curl http://localhost:5000/health

# Test API endpoint
curl http://localhost:5000/api/metadata
```

---

## Essential Configurations

After completing the installation, configure these essential settings. These configurations optimize the service for production use by enabling comprehensive logging and monitoring capabilities. Proper configuration ensures you can effectively troubleshoot issues and monitor service health in real-time:

### Logging Configuration

Set up structured logging to monitor service behavior and troubleshoot issues. The COMP service uses JSON-formatted logs that capture metadata operations, API requests, and system events with correlation IDs for request tracking. Configure logging levels in `appsettings.json` to control verbosity across different components:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "Microsoft.EntityFrameworkCore": "Warning",
      "Cardano.Metadata": "Debug"
    },
    "Console": {
      "FormatterName": "json",
      "FormatterOptions": {
        "SingleLine": true,
        "IncludeScopes": true,
        "TimestampFormat": "yyyy-MM-dd HH:mm:ss",
        "UseUtcTimestamp": true
      }
    }
  }
}
```

### Monitoring Setup

Enable health checks and metrics collection for production monitoring. The service provides health endpoints for liveness and readiness checks, compatible with Kubernetes and other orchestration platforms. Metrics are exposed in Prometheus format, tracking API performance, database queries, and metadata processing operations:

```json
{
  "HealthChecks": {
    "Database": true,
    "Memory": true,
    "LivenessPath": "/health/live",
    "ReadinessPath": "/health/ready",
    "DetailedErrors": false
  },
  "Metrics": {
    "Enabled": true,
    "Endpoint": "/metrics",
    "IncludeDatabase": true,
    "IncludeHttp": true,
    "IncludeProcess": true
  }
}
```


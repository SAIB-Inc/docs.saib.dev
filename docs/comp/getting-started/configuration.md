---
title: Configuration
sidebar_position: 3
---

# Configuration

Configure the Cardano.Metadata service to work with your specific requirements and environment. The service provides flexible configuration options through `appsettings.json` and environment variables. All configuration settings support hot-reloading, allowing you to update values without restarting the service. Environment variables take precedence over JSON configuration files, making it easy to override settings in different deployment scenarios.

---

## Basic Configuration
The service uses standard ASP.NET Core configuration. Here's a basic `appsettings.json` structure. This configuration file should be placed in the root directory of the application and contains all essential settings for database connectivity, GitHub integration, and logging. The JSON format allows for nested configuration sections and supports arrays for multiple values:

```json
{
  "ConnectionStrings": {
    "Metadata": "Host=localhost;Database=cardano_metadata;Username=metadata_user;Password=your_password"
  },
  "Github": {
    "Token": "your_github_personal_access_token"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## Database Configuration

### PostgreSQL Connection

Configure your PostgreSQL database connection. The connection string supports all standard PostgreSQL parameters including SSL mode for secure connections and connection timeouts. Each parameter in the connection string can be configured independently, allowing fine-tuned control over database behavior:

| Setting | Description | Example |
|---------|-------------|---------|
| `Host` | Database server hostname | `localhost` or `postgres` |
| `Database` | Database name | `cardano_metadata` |
| `Username` | Database user | `metadata_user` |
| `Password` | Database password | `secure_password` |
| `Port` | Database port (optional) | `5432` |

```json
{
  "ConnectionStrings": {
    "Metadata": "Host=localhost;Port=5432;Database=cardano_metadata;Username=metadata_user;Password=secure_password;SSL Mode=Require"
  }
}
```

### Connection Pool Settings

For high-load scenarios, configure connection pooling. Connection pooling reduces the overhead of creating new database connections by maintaining a pool of reusable connections. The pool size parameters should be adjusted based on your application's concurrent user load and database server capacity:

```json
{
  "ConnectionStrings": {
    "Metadata": "Host=localhost;Database=cardano_metadata;Username=metadata_user;Password=secure_password;Minimum Pool Size=5;Maximum Pool Size=100;Connection Lifetime=300"
  }
}
```

---

## GitHub Integration

### Personal Access Token

The service requires a GitHub Personal Access Token for API access. This token enables the COMP service to interact with GitHub repositories for metadata management and synchronization. Ensure the token has appropriate scopes including repo access for reading repository content and metadata:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with appropriate scopes
3. Configure in your settings:

```json
{
  "Github": {
    "Token": "ghp_your_token_here",
    "ApiUrl": "https://api.github.com/",
    "RawUrl": "https://raw.githubusercontent.com/"
  }
}
```

### Rate Limiting

Configure GitHub API rate limiting behavior. GitHub imposes rate limits on API requests, and this configuration helps manage those limits effectively. The service automatically handles rate limit responses and implements exponential backoff with configurable retry attempts:

```json
{
  "Github": {
    "Token": "ghp_your_token_here",
    "RateLimit": {
      "RequestsPerHour": 5000,
      "RetryDelay": 60,
      "MaxRetries": 3
    }
  }
}
```

---

## Logging Configuration

### Structured Logging

Configure detailed logging for different components. The logging configuration allows granular control over log verbosity for each namespace in the application. This helps reduce log noise in production while maintaining detailed debugging information for specific components when needed:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Cardano.Metadata.Services": "Debug",
      "Cardano.Metadata.Workers": "Information",
      "Microsoft.EntityFrameworkCore": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### File Logging

Add file logging for production environments. File-based logging provides persistent log storage with automatic rotation based on file size and count. The log files use a date-based naming pattern and can be configured to retain a specific number of historical files:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    },
    "File": {
      "Path": "/app/logs/cardano-metadata-.log",
      "MaxFileSize": "10MB",
      "MaxFiles": 5
    }
  }
}
```

---

## Health Checks

Configure health check endpoints. Health checks provide critical monitoring capabilities for the service, verifying database connectivity and external API availability. The timeout values ensure that health checks fail fast when dependencies are unavailable, preventing cascading failures:

```json
{
  "HealthChecks": {
    "Database": {
      "Enabled": true,
      "Timeout": "00:00:10"
    },
    "Github": {
      "Enabled": true,
      "Timeout": "00:00:05"
    }
  }
}
```



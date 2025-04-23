---
title: Logging
sidebar_label: Logging
sidebar_position: 4
---

Argus provides built-in logging and an optional terminal UI dashboard to help you monitor sync progress and debug issues. You can configure logging behavior and enable or disable the TUI in your `appsettings.json`.

## Text-based Logging

By default, Argus uses .NET’s `ILogger` infrastructure. Configure log levels under the `Logging` section:

```json
"Logging": {
  "LogLevel": {
    "Default": "Information",
    "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
  }
}
```

- **Default** controls general library and application logs.
- **Microsoft.EntityFrameworkCore.Database.Command** limits EF Core SQL command verbosity.

When running normally (TUI disabled), logs output to the console or any registered providers (e.g., file, Application Insights).

## Terminal UI Dashboard (TUI)

For interactive monitoring during development or debugging, enable the TUI under `Sync.Dashboard`:

```json
"Sync": {
  "Dashboard": {
    "TuiMode": true,
    "DisplayType": "sync",
    "RefreshInterval": 5000
  }
}
```

- **TuiMode**: `true` to activate TUI, `false` for plain text logs.
- **DisplayType**: `sync` shows progress bars per reducer; `full` shows additional stats (overall progress, CPU/memory usage).
- **RefreshInterval**: UI refresh rate in milliseconds.

### Sync Display

When `DisplayType` is `sync`, you’ll see:

- A progress bar for each registered reducer, indicating percentage synced relative to the current blockchain tip.
- Slot numbers and throughput metrics.

### Full Display

When `DisplayType` is `full`, the dashboard includes:

- Individual reducer progress bars.
- An overall sync progress indicator.
- CPU and memory usage statistics for your process.

The TUI is best for local development and performance tuning. In production, disable `TuiMode` to integrate logs with your telemetry stack.

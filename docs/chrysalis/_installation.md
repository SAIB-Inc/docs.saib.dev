---
title: Installation
sidebar_position: 2
---

## Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 9 SDK or later** ([download here](https://dotnet.microsoft.com/download))
- **IDE or Editor:** Visual Studio 2022, Visual Studio Code, Rider, or similar.
- **NuGet CLI:** Accessible via the .NET CLI or IDE package manager.

### Step 1: Adding Chrysalis to Your Project

Open your terminal or command prompt in your project's root directory and execute:

```bash
dotnet add package Chrysalis --version 0.7.2
```

*(Replace `0.7.2` with the latest stable version.)*

### Step 2: Verify Your Installation

Open your project's `.csproj` file and confirm the following package reference is present:

```xml
<ItemGroup>
  <PackageReference Include="Chrysalis" Version="0.7.2" />
</ItemGroup>
```

Run the build command to restore packages and ensure your project compiles correctly:

```bash
dotnet build
```

Your project is now configured to use Chrysalis, and you are ready to start building.

---




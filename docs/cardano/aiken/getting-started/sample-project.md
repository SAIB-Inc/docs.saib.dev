---
title: Creating a Sample Project
sidebar_position: 2
---

# Creating Your First Aiken Project

This guide walks you through creating your first Aiken smart contract project from scratch. You'll learn how to initialize a project, understand its structure, write a practical time-lock validator, and test your smart contract - providing a solid foundation for building more complex applications on Cardano.

---

## Initialize a New Project

Create a new Aiken project using the CLI:

```bash
aiken new hello-aiken
cd hello-aiken
```

This creates a project structure:
```
hello-aiken/
├── aiken.toml          # Project configuration
├── lib/                # External dependencies
├── validators/         # Your smart contracts
└── README.md
```

---

## Project Configuration

The `aiken.toml` file is the heart of your project configuration. It defines metadata, dependencies, and compiler settings.

### Basic Configuration

```toml
name = "hello-aiken"
version = "0.0.0"
license = "Apache-2.0"
description = "Aiken smart contracts for hello-aiken"

[repository]
user = "your-username"
project = "hello-aiken"
platform = "github"

[dependencies]
# Dependencies will be listed here
```

### Advanced Configuration Options

You can extend the configuration with additional settings:

```toml
# Extended project metadata
name = "hello-aiken"
version = "0.0.0"
license = "Apache-2.0"
description = "Aiken smart contracts for hello-aiken"
authors = ["Your Name <your.email@example.com>"]
readme = "README.md"
homepage = "https://your-project-homepage.com"

[repository]
user = "your-username"
project = "hello-aiken"
platform = "github"

# Compiler configuration
[config]
# Network selection for script addresses (mainnet, preview, preprod, or custom)
network = "preview"

# Custom network configuration (if not using predefined networks)
# [config.network]
# magic = 2
# protocol_parameters = { ... }

# Build configuration
[build]
# Output directory for compiled artifacts
output = "build"

# Enable or disable optimization (default: true)
optimize = true

# Dependencies from official package registry
[dependencies]
aiken-lang/stdlib = "1.9.0"
aiken-lang/fuzz = "1.0.0"

# Git dependencies with specific commits or branches
[dependencies.custom-lib]
name = "custom-lib"
version = "1.0.0"
source = "github"
user = "some-user"
project = "custom-validators"
rev = "main"  # Can be branch, tag, or commit hash

# Local dependencies for development
[dependencies.local-lib]
name = "local-lib"
version = "1.0.0"
path = "../local-validators"
```

### Environment-Specific Configuration

You can use environment variables in your configuration:

```toml
# Reference environment variables
[repository]
user = "${GITHUB_USER}"
project = "${GITHUB_PROJECT}"
platform = "github"

# Network selection based on environment
[config]
network = "${CARDANO_NETWORK:-preview}"  # Default to preview if not set
```

### Version Compatibility

Specify Aiken version requirements:

```toml
[toolchain]
# Minimum Aiken version required
aiken = ">=1.0.26"

# Or exact version
# aiken = "=1.0.26"

# Or version range
# aiken = ">=1.0.26,<2.0.0"
```

---

## Creating a Simple Slot-Based Validator

Let's create a practical validator that locks funds until a specific time. This demonstrates core Aiken concepts.

:::info New to validators?
Before diving into implementation, you might want to read our comprehensive guide on [Validators](../validators) to learn about validator types, parameters, and best practices.
:::

### 1. Create the Validator

Create `validators/timelock.ak`:

This time-lock validator demonstrates core Aiken concepts by locking funds until a specific slot or allowing early withdrawal by a designated beneficiary.

**Key Components:**

- **Datum**: Stores data with the locked UTxO (beneficiary and unlock slot)
- **Redeemer**: Data provided when trying to spend (unused in this example)
- **ScriptContext**: Transaction information provided by Cardano
- **Validator Logic**: Funds can be spent if:
  - The beneficiary signs the transaction, OR
  - The current slot is after the unlock slot

```aiken
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Spend}
use aiken/transaction/credential.{VerificationKey}

/// Datum structure that holds the unlock conditions
type Datum {
  /// Who can unlock the funds
  beneficiary: Hash<Blake2b_224, VerificationKey>,
  /// Slot number after which anyone can unlock the funds
  unlock_slot: Int,
}

/// Main validator function
validator {
  fn timelock(datum: Datum, _redeemer: Data, context: ScriptContext) -> Bool {
    // Ensure this is a spending transaction
    when context.purpose is {
      Spend(_) ->
        // Either signed by beneficiary OR after unlock slot
        or {
          must_be_signed_by(context.transaction, datum.beneficiary),
          must_start_after(context.transaction.validity_range, datum.unlock_slot),
        }
      _ -> False
    }
  }
}

/// Check if transaction is signed by the given public key hash
fn must_be_signed_by(transaction: Transaction, vk: Hash<Blake2b_224, VerificationKey>) -> Bool {
  list.has(transaction.extra_signatories, vk)
}

/// Check if transaction validity starts after the unlock slot
fn must_start_after(range: ValidityRange, unlock_slot: Int) -> Bool {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_slot) -> unlock_slot <= tx_earliest_slot
    _ -> False
  }
}
```

The validator uses Aiken's `or` operator to allow spending under either condition, and helper functions to check signatures and time constraints. The `_redeemer` parameter is prefixed with underscore to indicate it's intentionally unused.

### 2. Build the Project

Compile your validator to generate on-chain scripts:

```bash
aiken build
```

This command performs several steps:
1. **Type checking**: Ensures your code is type-safe
2. **Compilation**: Converts Aiken code to Untyped Plutus Core (UPLC)
3. **Optimization**: Reduces script size for lower transaction fees
4. **Output generation**: Creates deployment artifacts

**Generated Files:**

```
build/
├── packages/         # Compiled dependencies
└── hello-aiken/      # Your compiled project
    └── plutus.json   # Main output file
```

The `plutus.json` file contains:
- **Compiled validators**: UPLC bytecode for each validator
- **Script hashes**: Unique identifiers for your scripts
- **Applied validators**: If using parameterized validators

**Inspecting the Output:**

```bash
# View the entire plutus.json structure
cat plutus.json | jq '.'

# Get the validator's script hash (used as the script address)
cat plutus.json | jq '.validators[0].hash'

# Get the compiled UPLC code size (in bytes)
cat plutus.json | jq '.validators[0].compiledCode' | wc -c

# List all validators in the project
cat plutus.json | jq '.validators[].title'
```

### 3. Add Dependencies

Aiken uses a package management system similar to other modern languages. Dependencies provide reusable code, utilities, and common patterns.

**Adding the Standard Library:**

The Aiken standard library (`stdlib`) provides essential utilities for working with Cardano data types. Add it to your `aiken.toml`:

```toml
[dependencies]
aiken-lang/stdlib = "1.9.0"
```

**Installing Dependencies:**

```bash
aiken packages install
```

This command:
- Downloads specified packages from the registry
- Verifies package integrity
- Installs them in the `build/packages/` directory
- Makes them available for import in your code

**Common Dependencies:**

```toml
[dependencies]
# Essential utilities and data structures
aiken-lang/stdlib = "1.9.0"

# Property-based testing framework
aiken-lang/fuzz = "1.0.0"
```

**Using Dependencies in Code:**

Once installed, import modules from dependencies:

```aiken
// Import specific functions
use aiken/dict.{Dict}
use aiken/interval.{Interval}

// Import entire modules
use aiken/bytearray
use aiken/time
```

**Checking Installed Packages:**

```bash
# List all installed dependencies
aiken packages list

# Check for outdated packages
aiken packages outdated

# View package documentation
aiken docs --dependency aiken-lang/stdlib
```

**Dependency Resolution:**

Aiken automatically resolves transitive dependencies. If package A depends on package B, both will be installed. The lock file (`aiken.lock`) ensures reproducible builds across different environments.

### 4. Writing Tests

Create `validators/tests/timelock_test.ak`:

Testing validators is crucial for ensuring correctness. Aiken provides a built-in testing framework with simple assertions.

```aiken
use aiken/interval
use hello_aiken/timelock.{Datum, timelock}

// Test helper to create a mock context
use aiken/transaction.{
  ScriptContext, Spend, Transaction, placeholder
}

test unlock_after_slot() {
  // Arrange: Create test data
  let datum = Datum {
    beneficiary: #"00000000000000000000000000000000000000000000000000000000",
    unlock_slot: 1000,
  }
  
  // Act: Create context with validity range after unlock slot
  let ctx = ScriptContext {
    purpose: Spend(placeholder.output_reference),
    transaction: Transaction {
      ..placeholder.transaction,
      validity_range: interval.after(1001),  // After slot 1000
    }
  }
  
  // Assert: Validator should return true
  timelock(datum, Void, ctx)
}

test unlock_before_slot() fail {
  // This test expects to fail (note the 'fail' keyword)
  let datum = Datum {
    beneficiary: #"00000000000000000000000000000000000000000000000000000000",
    unlock_slot: 1000,
  }
  
  let ctx = ScriptContext {
    purpose: Spend(placeholder.output_reference),
    transaction: Transaction {
      ..placeholder.transaction,
      validity_range: interval.before(999),  // Before slot 1000
    }
  }
  
  // Should fail because current slot (max 999) < unlock slot (1000)
  timelock(datum, Void, ctx)
}
```

**Running Tests:**

```bash
# Run all tests
aiken check

# Run tests with verbose output
aiken check -v

# Run specific test file
aiken check validators/tests/timelock_test.ak

# Watch mode - re-run tests on file changes
aiken check --watch
```

**Test Output:**

```
┍━ hello-aiken ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ PASS [mem: 35053, cpu: 12895422] unlock_after_slot
│ PASS [mem: 35053, cpu: 12895422] unlock_before_slot
┕━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2 tests | 2 passed
```

**Understanding Test Annotations:**

- **`test`**: Marks a function as a test case
- **`fail`**: Indicates the test should fail (validator returns false)
- **Memory/CPU**: Shows resource usage for on-chain execution

**Test Best Practices:**

1. Test both success and failure cases
2. Use descriptive test names
3. Keep tests focused on single behaviors
4. Use the `fail` annotation for negative tests
5. Leverage helper functions for common setup


## Next Steps

You now have a working Aiken project with:
- A time-lock validator that controls fund access based on slots
- Comprehensive tests demonstrating both success and failure cases
- Understanding of the build process and dependency management

Continue your Aiken journey:
- **Deep dive into validators**: Read our comprehensive [validators](../validators) guide to master different validator types and patterns
- **Build real applications**: Create more complex validators combining multiple conditions, datum structures, and redeemer actions
- **Integrate with off-chain code**: Use [Chrysalis'](/docs/chrysalis/overview) transaction-building library for seamless .NET integration with your Aiken validators
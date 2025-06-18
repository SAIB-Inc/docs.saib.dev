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

The `aiken.toml` file contains your project metadata:

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

---

## Creating a Simple Time-Lock Validator

Let's create a practical validator that locks funds until a specific time. This demonstrates core Aiken concepts.

### 1. Create the Validator

Create `validators/timelock.ak`:

```aiken
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Spend}
use aiken/transaction/credential.{VerificationKey}

/// Datum structure that holds the unlock conditions
type Datum {
  /// Who can unlock the funds
  beneficiary: Hash<Blake2b_224, VerificationKey>,
  /// When the funds can be unlocked (POSIX time in milliseconds)
  deadline: Int,
}

/// Main validator function
validator {
  fn timelock(datum: Datum, _redeemer: Data, context: ScriptContext) -> Bool {
    // Ensure this is a spending transaction
    when context.purpose is {
      Spend(_) ->
        // Either signed by beneficiary OR after deadline
        or {
          must_be_signed_by(context.transaction, datum.beneficiary),
          must_start_after(context.transaction.validity_range, datum.deadline),
        }
      _ -> False
    }
  }
}

/// Check if transaction is signed by the given public key hash
fn must_be_signed_by(transaction: Transaction, vk: Hash<Blake2b_224, VerificationKey>) -> Bool {
  list.has(transaction.extra_signatories, vk)
}

/// Check if transaction validity starts after the deadline
fn must_start_after(range: ValidityRange, deadline: Int) -> Bool {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_time) -> deadline <= tx_earliest_time
    _ -> False
  }
}
```

### 2. Understanding the Code

**Key Components:**

- **Datum**: Stores data with the locked UTxO (beneficiary and deadline)
- **Redeemer**: Data provided when trying to spend (unused in this example)
- **ScriptContext**: Transaction information provided by Cardano
- **Validator Logic**: Funds can be spent if:
  - The beneficiary signs the transaction, OR
  - The current time is after the deadline

### 3. Build the Project

Compile your validator:

```bash
aiken build
```

This generates:
- `plutus.json`: Contains compiled validators and their script addresses
- Blueprint files for off-chain integration

Check the output:
```bash
cat plutus.json | jq '.validators[0].hash'
```

### 4. Add Dependencies

Aiken has a package ecosystem. Let's add the standard library:

Edit `aiken.toml`:
```toml
[dependencies]
aiken-lang/stdlib = "1.7.0"
```

Install dependencies:
```bash
aiken packages install
```

### 5. Writing Tests

Create `validators/tests/timelock_test.ak`:

```aiken
use aiken/transaction.{ScriptContext, Spend, Transaction, ValidityRange}
use hello_aiken/timelock.{Datum, timelock}

test timelock_allows_beneficiary_anytime() {
  let datum = Datum {
    beneficiary: #"00000000000000000000000000000000000000000000000000000000",
    deadline: 1000,
  }
  
  let context = ScriptContext {
    purpose: Spend(mock_utxo_ref()),
    transaction: Transaction {
      ..mock_transaction(),
      extra_signatories: [datum.beneficiary],
    }
  }
  
  timelock(datum, Void, context)
}

test timelock_allows_anyone_after_deadline() {
  let datum = Datum {
    beneficiary: #"00000000000000000000000000000000000000000000000000000000",
    deadline: 1000,
  }
  
  let context = ScriptContext {
    purpose: Spend(mock_utxo_ref()),
    transaction: Transaction {
      ..mock_transaction(),
      validity_range: interval.after(1001),
      extra_signatories: [],
    }
  }
  
  timelock(datum, Void, context)
}

test timelock_prevents_before_deadline() fail {
  let datum = Datum {
    beneficiary: #"00000000000000000000000000000000000000000000000000000000",
    deadline: 1000,
  }
  
  let context = ScriptContext {
    purpose: Spend(mock_utxo_ref()),
    transaction: Transaction {
      ..mock_transaction(),
      validity_range: interval.before(999),
      extra_signatories: [],
    }
  }
  
  timelock(datum, Void, context)
}
```

Run the tests:
```bash
aiken check
```

---

## Project Structure Best Practices

### Organizing Validators

For larger projects, organize your code:

```
validators/
├── core/
│   ├── payment.ak
│   └── governance.ak
├── utils/
│   ├── time.ak
│   └── validation.ak
└── tests/
    ├── payment_test.ak
    └── governance_test.ak
```

### Documentation

Add documentation to your functions:

```aiken
/// Validates that a transaction occurs within a specific time window
/// 
/// @param start The earliest valid time (inclusive)
/// @param end The latest valid time (inclusive)
/// @param range The transaction's validity range
/// @return True if the transaction is within the time window
fn within_time_window(start: Int, end: Int, range: ValidityRange) -> Bool {
  // Implementation
}
```

Generate documentation:
```bash
aiken docs
```

---

## Common Patterns

### 1. Multi-signature Validator

```aiken
validator {
  fn multisig(
    required_signatures: Int,
    signatories: List<Hash<Blake2b_224, VerificationKey>>,
    _redeemer: Data,
    context: ScriptContext
  ) -> Bool {
    let signed_count = 
      list.count(signatories, fn(signatory) {
        list.has(context.transaction.extra_signatories, signatory)
      })
    
    signed_count >= required_signatures
  }
}
```

### 2. Token Sale Validator

```aiken
type SaleDatum {
  seller: Address,
  price_per_token: Int,
  token_policy: PolicyId,
}

validator {
  fn token_sale(datum: SaleDatum, _redeemer: Data, context: ScriptContext) -> Bool {
    expect Spend(own_ref) = context.purpose
    
    // Find own input
    expect Some(own_input) = 
      list.find(context.transaction.inputs, fn(input) {
        input.output_reference == own_ref
      })
    
    // Calculate expected payment
    let tokens_being_sold = 
      value.quantity_of(own_input.output.value, datum.token_policy, "")
    let expected_payment = tokens_being_sold * datum.price_per_token
    
    // Verify payment to seller
    check_payment_to(context.transaction.outputs, datum.seller, expected_payment)
  }
}
```

---

## Next Steps

You now have a working Aiken project with:
- A time-lock validator
- Comprehensive tests
- Understanding of project structure

Continue learning by:
- Exploring more complex validator patterns
- Building multi-validator applications
- Integrating with off-chain code
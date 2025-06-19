---
title: Validators
sidebar_position: 3
---

# Validators in Aiken

Validators are the core building blocks of smart contracts on Cardano. They are pure functions that determine whether a transaction can spend a UTxO, mint tokens, or withdraw rewards. This guide explains how validators work and how to write them effectively in Aiken.

---

## What Are Validators?

Validators are Plutus scripts that enforce on-chain logic. They are deterministic programs that run on the Cardano blockchain to validate transactions according to custom rules you define.

### Core Characteristics

**Pure Functions**: Validators are pure functions with no side effects. Given the same inputs, they always produce the same output.

**Boolean Output**: Validators evaluate to either `true` (allowing the action) or `false` (rejecting it). There's no middle ground—a transaction either passes validation or fails entirely.

**Executed by Nodes**: When a transaction attempts to interact with a validator, every node in the Cardano network executes the validator code independently to verify the transaction's validity.

### How Validators Work

1. **Deployment**: Validators are compiled to Plutus Core and their hash becomes an on-chain address
2. **Locking**: Users send funds or tokens to the validator's address with attached datum
3. **Unlocking**: To spend/use locked assets, users must provide:
   - A redeemer (unlock key/proof)
   - A transaction that satisfies the validator's logic
4. **Validation**: The Cardano node executes the validator with provided inputs
5. **Result**: Transaction succeeds if validator returns `true`, fails if `false`

### Validator Types

Cardano supports three types of validators, each serving a specific purpose:

#### 1. Spending Validators

The most common validator type, controlling when UTxOs can be spent from a script address.

**Use Cases:**
- Slot-based contracts
- Multi-signature wallets
- DEX liquidity pools

**Key Points:**

- **Datum**: Each UTxO locked at a script address must include a datum (either inline or as a hash). This datum contains the "state" or "conditions" of the locked funds.

- **Three Parameters**: Spending validators receive three inputs:
  - `datum`: The data attached when the UTxO was created (e.g., unlock conditions, beneficiary info)
  - `redeemer`: The "key" or "proof" provided by whoever is trying to spend the UTxO
  - `context`: Full transaction details including all inputs, outputs, signatures, and validity range

- **Script Address**: When compiled, the validator's hash becomes a unique script address. Anyone can send funds to this address, but only transactions that satisfy the validator logic can spend from it.

```aiken
validator {
  fn spend(datum: Datum, redeemer: Redeemer, context: ScriptContext) -> Bool {
    // Validate spending conditions
    // Access transaction inputs, outputs, signatures, etc.
  }
}
```

#### 2. Minting Policies

Control the minting and burning of native tokens on Cardano.

**Use Cases:**
- NFT minting with unique properties
- Fungible token supplies
- Burn mechanisms
- Wrapped assets

**Key Points:**

- **No Datum Parameter**: Unlike spending validators, minting policies only receive a redeemer and context. Tokens themselves don't carry datum—only UTxOs do.

- **Policy ID**: The compiled validator's hash becomes the Policy ID, which is permanently part of every token's identity. A token is uniquely identified by the combination of Policy ID + Token Name (e.g., `PolicyID.TokenName`).

- **Positive and Negative Minting**: 
  - Positive amounts = creating new tokens
  - Negative amounts = burning tokens (removing from ledger)

- **One-Time vs Reusable Policies**:
  - **One-time**: Check for specific UTxO consumption to ensure minting happens only once
  - **Reusable**: Implement conditions like signature checks for controlled minting
  - **Time-locked**: Allow minting only before/after certain slots

- **Token Standards**: While Cardano doesn't enforce standards at the protocol level, minting policies often follow conventions like:
  - [CIP-25](https://cips.cardano.org/cips/cip25/) for NFT metadata - defines how to attach metadata to NFTs including images, descriptions, and properties
  - [CIP-68](https://cips.cardano.org/cips/cip68/) for advanced token standards - introduces reference NFTs for updatable metadata

- **Common Validations**:
  - Verify authorized minter signatures
  - Check minting amounts and limits
  - Ensure metadata correctness for NFTs
  - Validate time windows for minting periods

```aiken
validator {
  fn mint(redeemer: Redeemer, context: ScriptContext) -> Bool {
    // Validate minting/burning conditions
    // Check amounts, verify authorization, enforce limits
  }
}
```

#### 3. Staking Validators

Control withdrawals from staking rewards and stake pool operations.

**Use Cases:**
- Shared staking accounts
- Protocol-owned liquidity staking
- Reward distribution mechanisms

**Key Points:**

- **Dual Purpose**: Staking validators can control two distinct operations:
  - **Reward Withdrawals**: Validating when accumulated staking rewards can be withdrawn
  - **Delegation Changes**: Controlling changes to stake pool delegation (though this is less common)

- **Reward Accumulation**: Staking rewards accumulate automatically without any transaction. The validator only controls when these rewards can be withdrawn to a regular address.

- **No Datum**: Like minting policies, staking validators only receive a redeemer and context. The withdrawal amount is specified in the transaction, not by the validator.

- **Integration with DeFi**: Staking validators enable:
  - Protocol-controlled treasury funds from staking
  - Liquid staking derivatives
  - Automated reward distribution systems

- **Common Validations**:
  - Multi-signature authorization for withdrawals
  - Slot-based withdrawal periods
  - Proportional distribution among multiple parties

```aiken
validator {
  fn withdraw(redeemer: Redeemer, context: ScriptContext) -> Bool {
    // Validate withdrawal conditions
    // Check authorization, amounts, timing
  }
}
```

---

## Validator Structure

Every validator follows a specific structure with well-defined parameters and return types. Understanding this structure is crucial for writing secure and efficient smart contracts.

### Core Components

```aiken
use aiken/transaction.{ScriptContext, Spend}
use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction/credential.{VerificationKey}

// Custom data types for your business logic
type MyDatum {
  owner: Hash<Blake2b_224, VerificationKey>,
  amount: Int,
}

type MyRedeemer {
  action: Action,
}

type Action {
  Claim
  Cancel
}

// The validator function - the entry point for on-chain execution
validator {
  fn my_validator(datum: MyDatum, redeemer: MyRedeemer, context: ScriptContext) -> Bool {
    when context.purpose is {
      Spend(_) -> 
        when redeemer.action is {
          Claim -> validate_claim(datum, context)
          Cancel -> validate_cancel(datum, context)
        }
      _ -> False
    }
  }
}
```

### Parameters Explained

#### 1. **Datum**

The datum represents the "state" or "conditions" attached to a locked UTxO. Think of it as the lock's configuration.

**Characteristics:**
- **Storage**: Can be stored inline (directly in the UTxO) or as a hash (actual data stored separately)
- **Immutability**: Once a UTxO is created with a datum, that datum cannot be changed
- **Visibility**: Public data viewable by anyone on the blockchain
- **Size Impact**: Larger datums increase transaction fees

**Common Patterns:**
```aiken
// Simple ownership datum
type OwnerDatum {
  owner: Address,
}

// Time-locked datum
type VestingDatum {
  beneficiary: Address,
  unlock_time: Int,
  amount_per_period: Int,
}

// Multi-condition datum
type EscrowDatum {
  buyer: Address,
  seller: Address,
  arbitrator: Address,
  price: Value,
  deadline: Int,
}
```

#### 2. **Redeemer**

The redeemer is the "key" or "proof" provided when attempting to unlock funds or perform an action. It's like presenting credentials to open a lock.

**Characteristics:**
- **Transaction-specific**: Provided fresh with each transaction attempt
- **Not stored**: Only exists during transaction validation
- **Flexible structure**: Can be any data type that helps prove the right to perform an action
- **Size matters**: Larger redeemers increase execution costs

**Common Patterns:**
```aiken
// Simple action redeemer
type Action {
  Withdraw
  Update
  Cancel
}

// Proof-based redeemer
type ProofRedeemer {
  merkle_proof: List<ByteArray>,
  signature: ByteArray,
}

// Empty redeemer (when context alone is sufficient)
type Unit {}
```

#### 3. **ScriptContext**

The ScriptContext provides complete information about the transaction attempting to interact with your validator. It's the validator's window into what's happening.

**Key Information Available:**
- **Transaction details**: All inputs, outputs, fees, and minted values
- **Script purpose**: Why the validator is being called (spending, minting, etc.)
- **Signatures**: Which wallets have signed the transaction
- **Time information**: Transaction validity time range
- **Other scripts**: Information about other validators in the same transaction

**Purpose Types:**
```aiken
type ScriptPurpose {
  // Spending a UTxO from a script address
  Spend(OutputReference)
  
  // Minting or burning tokens
  Mint(PolicyId)
  
  // Withdrawing staking rewards
  WithdrawFrom(StakeCredential)
  
  // Publishing a certificate (rare)
  Publish(Certificate)
}
```

**ScriptContext Structure:**
```aiken
type ScriptContext {
  transaction: Transaction,
  purpose: ScriptPurpose,
}

type Transaction {
  inputs: List<Input>,
  reference_inputs: List<Input>,
  outputs: List<Output>,
  fee: Value,
  mint: Value,
  certificates: List<Certificate>,
  withdrawals: Dict<StakeCredential, Int>,
  validity_range: ValidityRange,
  extra_signatories: List<Hash<Blake2b_224, VerificationKey>>,
  redeemers: Dict<ScriptPurpose, Redeemer>,
  datums: Dict<Hash<Blake2b_256, Data>, Data>,
  id: TransactionId,
}
```

**Common Context Checks:**
```aiken
use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/value

// Check if transaction is signed by a specific key
fn must_be_signed_by(tx: Transaction, pubkey_hash: ByteArray) -> Bool {
  list.has(tx.extra_signatories, pubkey_hash)
}

// Check if transaction happens after a specific time
fn must_start_after(validity_range: ValidityRange, time: Int) -> Bool {
  when validity_range.lower_bound.bound_type is {
    Finite(tx_earliest_time) -> time <= tx_earliest_time
    _ -> False
  }
}

// Check if a specific value is paid to an address
fn must_pay_to_address(outputs: List<Output>, address: Address, amount: Value) -> Bool {
  list.any(outputs, fn(output) {
    output.address == address && value.geq(output.value, amount)
  })
}
```

### Writing Validator Functions

Validators must follow specific function patterns based on their type. Each validator type has a distinct signature and always returns a boolean value.

```aiken
// Spending validator
validator {
  fn spend(datum: CustomDatum, redeemer: CustomRedeemer, ctx: ScriptContext) -> Bool {
    // Validation logic here
  }
}

// Minting policy
validator {
  fn mint(redeemer: CustomRedeemer, ctx: ScriptContext) -> Bool {
    // Note: No datum parameter for minting
  }
}

// Staking validator
validator {
  fn withdraw(redeemer: CustomRedeemer, ctx: ScriptContext) -> Bool {
    // Note: No datum parameter for staking
  }
}
```

**Return Value Requirements:**

- **Always Boolean**: Validators must return exactly `true` or `false`
  - `true` = Transaction is valid, allow the action
  - `false` = Transaction is invalid, reject entirely
  
- **No Partial Success**: If any validator in a transaction returns `false`, the entire transaction fails

- **No Error Messages**: Validators cannot return error messages or reasons for failure. Design your redeemer types to help debuggers understand validation requirements

- **Type Safety**: Aiken enforces that validators return `Bool`, not `Result`, `Option`, or any other type

---

## Writing Effective Validators

### 1. Keep It Simple

Validators should be as simple as possible while maintaining security:

```aiken
// Good: Clear and simple
validator {
  fn simple_lock(datum: ByteArray, redeemer: ByteArray, _ctx: ScriptContext) -> Bool {
    datum == redeemer
  }
}

// Avoid: Overly complex logic
validator {
  fn complex_lock(datum: ComplexDatum, redeemer: ComplexRedeemer, ctx: ScriptContext) -> Bool {
    // 100 lines of nested conditions...
  }
}
```

### 2. Fail Fast

Check the most likely failure conditions first:

```aiken
validator {
  fn optimized(datum: Datum, redeemer: Redeemer, context: ScriptContext) -> Bool {
    // Check purpose first (cheap)
    expect Spend(_) = context.purpose
    
    // Then check signatures (moderate cost)
    expect True = must_be_signed_by(context.transaction, datum.owner)
    
    // Finally check complex conditions (expensive)
    validate_outputs(context.transaction.outputs, datum.conditions)
  }
}
```

### 3. Use Expect for Cleaner Code

The `expect` keyword combines pattern matching with assertions:

```aiken
validator {
  fn clean_validator(datum: Datum, _redeemer: Data, context: ScriptContext) -> Bool {
    // Instead of nested when/is expressions
    expect Spend(own_ref) = context.purpose
    
    expect Some(own_input) = 
      list.find(context.transaction.inputs, fn(input) {
        input.output_reference == own_ref
      })
    
    expect [only_output] = context.transaction.outputs
    
    only_output.address == datum.recipient
  }
}
```

### 4. Parameterized Validators

Create reusable validators with parameters:

```aiken
validator(owner: ByteArray) {
  fn parameterized(_datum: Data, _redeemer: Data, context: ScriptContext) -> Bool {
    must_be_signed_by(context.transaction, owner)
  }
}
```

---

## Next Steps

Now that you understand validators in depth:

1. **Get Started**: If you haven't already, follow the [installation guide](./getting-started/installation) to set up Aiken on your system
2. **Build Your First Validator**: Work through the [sample project](./getting-started/sample-project) to create a time-lock validator with tests
4. **Connect with Off-chain Code**: Use [Chrysalis](/docs/chrysalis/overview) to build transactions that interact with your validators

Remember: Validators are the security-critical component of your dApp. Always write comprehensive tests and review your logic carefully before deploying to mainnet.
---
title: Cardano Data Structures
sidebar_position: 1
---

# 📊 Cardano Data Structures

This document explains the Cardano blockchain data structures exposed in Argus and how they map to the official CDDL specification. Understanding these structures is essential for building effective reducers that can extract and process blockchain data.

## 🔍 Introduction

Cardano uses CBOR (Concise Binary Object Representation) for serializing blockchain data and CDDL (Concise Data Definition Language) to specify the format of this data. Argus leverages the Chrysalis library, which provides strongly-typed C# representations of Cardano data structures.

&nbsp;

:::info
The Chrysalis library handles the complex CBOR serialization/deserialization process, providing easy-to-use extension methods that let you work with Cardano data in an object-oriented way without having to understand the intricacies of the binary format.
:::

## 📦 Block Structure

Blocks are the fundamental units of the Cardano blockchain, containing a header and multiple transactions.

### What is a Block?

A block in Cardano contains:
- A **header** with metadata about the block (hash, number, slot, issuer)
- A set of **transaction bodies** (the ledger state changes)
- **Transaction witness sets** (signatures, scripts, datums, redeemers)
- **Auxiliary data sets** (metadata linked to transactions)
- **Invalid transactions** (included but not applied to the ledger)

:::tip Why Blocks Matter
Every block represents a distinct point in the blockchain's history. For indexers like Argus, blocks provide the chronological framework for organizing all on-chain activity. The block's **slot number** is particularly important as it's used for rollback operations during chain reorganizations.
:::

### CDDL Definition

In the Cardano CDDL specification, a block is defined as:

```
block =
  [ header
  , transaction_bodies
  , transaction_witness_sets
  , auxiliary_data_set
  , invalid_transactions
  ]
```

### Using Blocks in Argus

Chrysalis provides the `Block` class (abstract) with era-specific implementations (`AlonzoCompatibleBlock`, `BabbageBlock`, and `ConwayBlock`). The following example shows how to access block data in a reducer:

```csharp
public async Task RollForwardAsync(Block block)
{
    // Access block metadata through extension methods
    string blockHash = block.Header().Hash();
    ulong blockNumber = block.Header().HeaderBody().BlockNumber();
    ulong slot = block.Header().HeaderBody().Slot();
    
    // Access transactions in the block
    foreach (var tx in block.TransactionBodies())
    {
        // Process each transaction
        string txHash = tx.Hash();
        // ...
    }
}
```

The extension methods abstract away the era-specific differences, providing a consistent interface regardless of the block's era.

&nbsp;

<details>
<summary>Common Block Processing Patterns</summary>

```csharp
// Calculate block time from slot
DateTime blockTime = GenesisParameters.ShelleyStart.AddSeconds(slot * GenesisParameters.SlotLengthInSeconds);

// Count total transactions
int txCount = block.TransactionBodies().Length;

// Get block producer (pool)
string poolId = BitConverter.ToString(block.Header().HeaderBody().IssuerVkey()).Replace("-", "").ToLowerInvariant();

// Process only certain transaction types
foreach (var tx in block.TransactionBodies())
{
    if (tx.HasMint()) {
        // Process NFT minting transactions
    }
    
    if (tx.HasWithdrawals()) {
        // Process stake reward withdrawals
    }
}
```

</details>

### Important Block Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| header | `block.Header()` | Get the block header |
| transaction_bodies | `block.TransactionBodies()` | Get all transactions in the block |
| transaction_witness_sets | `block.TransactionWitnessSets()` | Get transaction witnesses |
| auxiliary_data_set | `block.AuxiliaryDataSet()` | Get transaction metadata |
| invalid_transactions | `block.InvalidTransactions()` | Get invalid transactions |

&nbsp;

Additional useful header extension methods:

&nbsp;


| Method | Description |
|--------|-------------|
| `block.Header().Hash()` | Get the block hash |
| `block.Header().HeaderBody().BlockNumber()` | Get the block number |
| `block.Header().HeaderBody().Slot()` | Get the slot number |
| `block.Header().HeaderBody().BlockBodySize()` | Get the block size in bytes |
| `block.Header().HeaderBody().IssuerVkey()` | Get the block producer's verification key |

## 💸 Transactions

Transactions are the primary mechanism for state changes in Cardano. Each transaction consists of three main components that work together to create a valid ledger update.

&nbsp;

:::note Transaction Tripartite Structure
A complete Cardano transaction consists of:
1. **Transaction Body** - Contains the core state changes (inputs, outputs, fees)
2. **Transaction Witness Set** - Contains validation data (signatures, scripts, datums)
3. **Auxiliary Data** - Contains optional metadata (labels and values)
:::

### Transaction Structure

The overall transaction structure can be represented as:

```
transaction = [
  transaction_body,
  transaction_witness_set,
  auxiliary_data (optional)
]
```

### Transaction Body

The transaction body contains all the essential elements that define the ledger state change:

```
transaction_body = {
  0 : set<transaction_input>,    // inputs
  1 : [* transaction_output],    // outputs
  2 : coin,                      // fee
  ? 3 : uint,                    // ttl
  ? 4 : [* certificate],         // certificates
  ? 5 : withdrawals,             // rewards withdrawals
  ? 6 : update,                  // update proposal
  ? 7 : auxiliary_data_hash,     // hash of metadata (not the metadata itself)
  ? 8 : uint,                    // validity interval start
  ? 9 : script_data_hash,        // hash of script data (not the data itself)
  ? 11 : [* addr_keyhash],       // required signers
  ? 13 : set<transaction_input>, // collateral inputs
  ? 14 : transaction_output,     // collateral return
  ? 15 : coin,                   // total collateral
  ? 16 : set<transaction_input>  // reference inputs
  // Additional fields in Conway era for governance
}
```

:::tip Script Data Hash vs Actual Data
Note that the transaction body contains _hashes_ of auxiliary data and script data, not the actual data itself. The actual data is stored in the witness set or auxiliary data components. This design keeps the core transaction body lean while still enabling complex scripts and metadata.
:::

### Transaction Witness Set

The witness set contains all data needed to validate the transaction:

```
transaction_witness_set = {
  ? 0 : [* vkey_witness],      // Verification key witnesses (signatures)
  ? 1 : [* native_script],     // Native scripts
  ? 2 : [* bootstrap_witness], // Byron-era witnesses
  ? 3 : [* plutus_script],     // Plutus scripts
  ? 4 : [* plutus_data],       // Datums for Plutus scripts
  ? 5 : redeemers,             // Redeemers for Plutus scripts
  ? 6 : [* plutus_v2_script],  // Plutus V2 scripts (Babbage era)
  ? 7 : [* plutus_v3_script]   // Plutus V3 scripts (Conway era)
}
```

### Auxiliary Data

Auxiliary data contains optional metadata that doesn't affect validation:

```
auxiliary_data = {
  metadata,                   // Transaction metadata
  ? scripts,                  // Auxiliary scripts (shelley)
  ? auxiliary_data_set        // Additional auxiliary data (alonzo+)
}
```

<details>
<summary>Why This Three-Part Structure Matters</summary>

Cardano's transaction design has several advantages:
- **Separation of concerns** - Core state changes are distinct from validation data
- **Bandwidth efficiency** - Scripts and metadata don't need to be passed around during transaction construction
- **Simpler validation** - The transaction body defines the ledger update, while witnesses just prove authorization
- **Metadata isolation** - Optional data doesn't affect consensus rules

For Argus developers, this means you need to understand which component contains the data you're interested in indexing.
</details>

### Using Transactions in Argus

Chrysalis provides extension methods to access all three components:

```csharp
// Get the transaction body
var txBody = tx;  // tx is already the transaction body in the RollForwardAsync method

// Basic transaction information from the body
string txHash = txBody.Hash();
ulong fee = txBody.Fee();

// Access transaction body components
var inputs = txBody.Inputs();
var outputs = txBody.Outputs();

// Check for optional components
if (txBody.HasCertificates())
{
    var certificates = txBody.Certificates();
    // Process certificates
}

if (txBody.HasWithdrawals())
{
    var withdrawals = txBody.Withdrawals();
    // Process withdrawals
}

if (txBody.HasMint())
{
    var mint = txBody.Mint();
    // Process token minting/burning
}

// Access the witness set from the block
var witnessSet = block.TransactionWitnessSets()[index];  // Get witness set at same index as body

// Process signatures
if (witnessSet.HasVKeyWitnesses())
{
    var signatures = witnessSet.VKeyWitnesses();
    // Process signatures
}

// Process Plutus scripts
if (witnessSet.HasPlutusScripts())
{
    var plutusScripts = witnessSet.PlutusScripts();
    // Process Plutus scripts
}

// Process datums
if (witnessSet.HasPlutusData())
{
    var datums = witnessSet.PlutusData();
    // Process datums
}

// Process redeemers
if (witnessSet.HasRedeemers())
{
    var redeemers = witnessSet.Redeemers();
    // Process redeemers
}

// Access metadata from the auxiliary data set
var auxDataSet = block.AuxiliaryDataSet();
if (auxDataSet.ContainsKey(txHash))
{
    var metadata = auxDataSet[txHash];
    // Process metadata
}
```

:::warning Matching Components
It's crucial to remember that transaction bodies, witness sets, and auxiliary data entries in a block are aligned by index. The witness set at index `i` corresponds to the transaction body at index `i`. Always maintain this relationship when processing transactions.
:::

### Important Transaction Body Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| 0: inputs | `tx.Inputs()` | Get transaction inputs |
| 1: outputs | `tx.Outputs()` | Get transaction outputs |
| 2: fee | `tx.Fee()` | Get transaction fee in lovelace |
| 3: ttl | `tx.ValidTo()` | Get transaction time-to-live |
| 4: certificates | `tx.Certificates()` | Get certificates |
| 5: withdrawals | `tx.Withdrawals()` | Get reward withdrawals |
| 7: auxiliary_data_hash | `tx.AuxiliaryDataHash()` | Get hash of metadata |
| 8: validity_interval_start | `tx.ValidFrom()` | Get validity start (slot) |
| 9: script_data_hash | `tx.ScriptDataHash()` | Get hash of script data |
| 11: required_signers | `tx.RequiredSigners()` | Get required signers |
| 13: collateral_inputs | `tx.Collateral()` | Get collateral inputs |
| 16: reference_inputs | `tx.ReferenceInputs()` | Get reference inputs |

### Important Witness Set Methods

| Component | Extension Method | Description |
|-----------|------------------|-------------|
| VKey Witnesses | `witnessSet.VKeyWitnesses()` | Get signatures |
| Native Scripts | `witnessSet.NativeScripts()` | Get native scripts |
| Plutus Scripts | `witnessSet.PlutusScripts()` | Get Plutus scripts |
| Plutus Data | `witnessSet.PlutusData()` | Get datums |
| Redeemers | `witnessSet.Redeemers()` | Get redeemers |

### Additional Useful Transaction Methods

| Method | Description |
|--------|-------------|
| `tx.Hash()` | Get the transaction hash |
| `tx.HasMetadata()` | Check if the transaction has metadata |
| `tx.HasMint()` | Check if the transaction mints/burns tokens |
| `tx.HasCertificates()` | Check if transaction has certificates |
| `tx.HasWithdrawals()` | Check if transaction has withdrawals |
| `tx.HasReferenceInputs()` | Check if the transaction has reference inputs |
| `tx.HasScriptDataHash()` | Check if the transaction has a script data hash |
| `tx.Raw?.ToArray()` | Get the raw transaction bytes (if available) |

## 🔗 Inputs and UTxOs

Cardano uses an extended UTxO model (eUTxO), a powerful evolution of Bitcoin's UTxO approach that enables complex smart contracts while maintaining the benefits of the original model.

&nbsp;

:::info The eUTxO Model
Unlike account-based systems (like Ethereum), Cardano's eUTxO model tracks individual "coins" rather than account balances. Each transaction consumes existing UTxOs as inputs and creates new UTxOs as outputs. This approach offers better scalability, predictability, and parallelism.
:::

### What are Inputs and UTxOs?

- **Input**: Reference to a UTxO being spent, consisting of:
  - Transaction ID that created the UTxO
  - Output index within that transaction
  
- **UTxO**: Unspent Transaction Output, a "coin" that can be spent, containing:
  - Address (recipient)
  - Value (ADA and native tokens)
  - Optional datum (for smart contracts)
  - Optional script reference (for reference scripts)
  
- **Output**: New UTxO created by a transaction

<details>
<summary>The eUTxO Advantage</summary>

Cardano's extended UTxO model offers several advantages:

- **Parallelism** - UTxOs can be processed in parallel, improving throughput
- **Determinism** - Transaction outcomes are predictable before submission
- **Privacy** - UTxOs provide better isolation between user activities
- **Smart contract capability** - Datums and validators enable complex logic

For Argus developers, this means you can efficiently track asset flows, account balances, and contract states by following UTxO consumption and creation.
</details>

### CDDL Definition

```
transaction_input = [transaction_id : $hash32, index : uint]

; In Babbage era and later
transaction_output =
  [ address
  , amount : value
  , ? datum_option        ; None, Hash, or Inline datum
  , ? script_reference    ; Optional reference to a script
  ]

; In Alonzo era and earlier
transaction_output = 
  [ address
  , amount : value
  ]
```

### Using Inputs and UTxOs in Argus

Chrysalis provides extension methods for transaction inputs and outputs:

```csharp
// Processing inputs (UTxOs being spent)
foreach (var input in tx.Inputs())
{
    string txId = input.TxId();     // Transaction that created this UTxO
    uint index = input.Index();     // Index of output in that transaction
    
    // Combine to form a unique UTxO reference
    string utxoRef = $"{txId}#{index}";
}

// Processing outputs (new UTxOs being created)
foreach (var output in tx.Outputs())
{
    string address = output.Address();     // Recipient address
    ulong adaAmount = output.Amount();     // ADA amount in lovelace
    
    // Process multi-asset outputs
    if (output.HasMultiAsset())
    {
        var multiAsset = output.MultiAsset();
        foreach (var policy in multiAsset)
        {
            string policyId = policy.Key();     // Policy ID (script hash)
            var assets = policy.Value();        // Assets under this policy
            
            foreach (var asset in assets)
            {
                byte[] assetNameBytes = asset.Key();   // Asset name as bytes
                ulong quantity = asset.Value();        // Quantity of this asset
                
                // Process each asset in the UTxO
            }
        }
    }
    
    // Process script-locked outputs
    if (output.HasDatum())
    {
        if (output.HasInlineDatum())
        {
            var datum = output.InlineDatum();     // Full datum (Babbage+)
            // Process inline datum
        }
        else
        {
            string datumHash = output.DatumHash();    // Just the hash
            // Process datum hash
        }
    }
    
    if (output.HasScriptRef())
    {
        var scriptRef = output.ScriptRef();    // Reference script (CIP-33)
        // Process script reference
    }
}
```

:::tip Building UTxO-Aware Applications
When building Argus indexers, consider creating a UTxO-tracking database that:
1. Adds new UTxOs when they appear in transaction outputs
2. Marks UTxOs as spent when they're used as inputs
3. Maintains a current "UTxO set" for any address

This approach enables efficient address balance queries, tracking of specific assets, and identification of script-locked UTxOs.
:::

### Important Input/UTxO Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| transaction_id | `input.TxId()` | Get the transaction ID |
| index | `input.Index()` | Get the output index |
| address | `output.Address()` | Get the recipient address |
| amount (ADA) | `output.Amount()` | Get ADA amount in lovelace |
| amount (assets) | `output.MultiAsset()` | Get non-ADA assets |
| datum_option | `output.Datum()` | Get the datum (if any) |
| script_reference | `output.ScriptRef()` | Get the script reference (if any) |

&nbsp;

Additional useful output methods:

&nbsp;


| Method | Description |
|--------|-------------|
| `output.HasMultiAsset()` | Check if the output contains non-ADA assets |
| `output.HasDatum()` | Check if the output has a datum |
| `output.HasInlineDatum()` | Check if the output has an inline datum |
| `output.InlineDatum()` | Get the inline datum data |
| `output.DatumHash()` | Get the datum hash |
| `output.HasScriptRef()` | Check if the output has a script reference |

## 📜 Certificates

Certificates are special transaction components that perform various operations in the Cardano system, particularly related to staking, pool management, and governance.


&nbsp; 

:::info Certificate Purpose
Certificates provide a standardized way to interact with Cardano's non-UTxO state components, such as the stake distribution, stake pool registry, and governance system. They represent commands that modify the ledger state in specific, predefined ways.
:::

### What are Certificates?

Certificates are used for:

- **Stake Management**
  - Registering stake addresses (enabling delegation)
  - Deregistering stake addresses (to recover deposit)
  - Delegating stake to pools (to earn rewards)

- **Pool Operations**
  - Registering stake pools (creating a new pool)
  - Updating pool parameters (changing margin, cost, etc.)
  - Retiring pools (removing from active set)

- **Governance Actions** (Conway era)
  - Registering/deregistering DReps (Delegated Representatives)
  - Committee member registrations/resignations
  - Vote delegations

<details>
<summary>Certificate Lifecycle</summary>

Most certificates follow a typical lifecycle:

1. **Creation** - A certificate is included in a transaction
2. **Validation** - Ledger rules verify the certificate is valid
3. **Effect** - The certificate modifies the ledger state
4. **Persistence** - The change remains until another certificate modifies it

For example, a stake registration certificate enables an address to delegate, and this registration persists until a deregistration certificate is processed.
</details>

### CDDL Definition

```
certificate =
  [ stake_registration
  // stake_deregistration
  // stake_delegation
  // pool_registration
  // pool_retirement
  // genesis_key_delegation
  // move_instantaneous_rewards_cert
  // drep_registration        ; Conway era
  // drep_deregistration      ; Conway era
  // drep_update              ; Conway era
  ]
```

### Using Certificates in Argus

Chrysalis provides extension methods for working with certificates:

```csharp
if (tx.HasCertificates())
{
    foreach (var cert in tx.Certificates())
    {
        // Get certificate type
        var certType = cert.Type();
        
        // Process based on certificate type
        switch (certType)
        {
            case CertificateType.StakeRegistration:
                var stakeKeyHash = cert.StakeRegistration().KeyHash();
                // Process stake registration (new delegation capability)
                break;
                
            case CertificateType.StakeDeregistration:
                var deregKeyHash = cert.StakeDeregistration().KeyHash();
                // Process stake deregistration (removing delegation)
                break;
                
            case CertificateType.StakeDelegation:
                var delegator = cert.StakeDelegation().KeyHash();
                var poolId = cert.StakeDelegation().PoolHash();
                // Process delegation certificate (delegating to a pool)
                break;
                
            case CertificateType.PoolRegistration:
                var poolParams = cert.PoolRegistration();
                var poolIdHash = poolParams.PoolKeyHash();
                var vrfKeyHash = poolParams.VrfKeyHash();
                var pledge = poolParams.Pledge();
                var cost = poolParams.Cost();
                var margin = poolParams.Margin();
                var rewardAcct = poolParams.RewardAccount();
                var poolOwners = poolParams.PoolOwners();
                var relays = poolParams.Relays();
                var poolMetadata = poolParams.PoolMetadata();
                // Process pool registration (new or updated pool)
                break;
                
            case CertificateType.PoolRetirement:
                var retiringPoolId = cert.PoolRetirement().PoolKeyHash();
                var retirementEpoch = cert.PoolRetirement().Epoch();
                // Process pool retirement (scheduled shutdown)
                break;
                
            // Conway-era governance certificates
            case CertificateType.DRepRegistration:
                // Process DRep registration
                break;
                
            // And other certificate types...
        }
    }
}
```

:::tip Certificate Tracking Applications
Certificates enable powerful indexing applications, such as:
- **Delegation dashboards** that track stake movements between pools
- **Pool analytics** showing registrations, parameter changes, and retirements
- **Governance platforms** monitoring DRep registrations and vote delegations
- **Reward calculators** that use delegation certificates to project staking returns
:::

### Important Certificate Fields and Extension Methods

| Certificate Type | Extension Method | Description |
|------------------|------------------|-------------|
| Stake Registration | `cert.StakeRegistration()` | Get stake registration data |
| Stake Deregistration | `cert.StakeDeregistration()` | Get stake deregistration data |
| Stake Delegation | `cert.StakeDelegation()` | Get stake delegation data |
| Pool Registration | `cert.PoolRegistration()` | Get pool registration data |
| Pool Retirement | `cert.PoolRetirement()` | Get pool retirement data |

&nbsp;

Common certificate methods:

&nbsp;


| Method | Description |
|--------|-------------|
| `cert.Type()` | Get the certificate type |
| `cert.StakeRegistration().KeyHash()` | Get the stake key hash |
| `cert.StakeDelegation().KeyHash()` | Get the delegator's key hash |
| `cert.StakeDelegation().PoolHash()` | Get the pool's key hash |
| `cert.PoolRegistration().PoolKeyHash()` | Get the pool's key hash |
| `cert.PoolRetirement().Epoch()` | Get the retirement epoch |

## 📝 Datums and Script References

Datums and script references are critical components enabling Cardano's smart contract capabilities through the extended UTxO model.

&nbsp;

:::info Smart Contracts in eUTxO
Unlike account-based blockchains where contracts have persistent storage, Cardano's eUTxO model uses **datums** to carry state between transactions and **validators** (scripts) to control when UTxOs can be spent. This design enables deterministic, parallelizable smart contracts.
:::

### What are Datums and Script References?

- **Datum**: Data attached to a UTxO that serves multiple purposes:
  - Provides input to validation scripts
  - Carries state information for contracts
  - Stores user-specific parameters
  
- **Script Reference**: Reference to a script that:
  - Defines the conditions for spending a UTxO
  - Can be a native script (multi-sig, timelock) or Plutus script (smart contract)
  - May be referenced by multiple UTxOs (via CIP-33 reference scripts)

<details>
<summary>Datum Usage Evolution</summary>

Datum handling has evolved across Cardano eras:

- **Alonzo Era**: Datums were referenced by hash only, requiring the full datum to be supplied in the spending transaction
- **Babbage Era**: Added inline datums (CIP-32), storing the complete datum on-chain with the UTxO
- **Conway Era**: Enhanced script capabilities with Plutus V3, enabling more advanced datum usage

Similarly, script references (CIP-33) were introduced in Babbage to reduce transaction sizes by allowing scripts to be referenced rather than included in each transaction.
</details>

### CDDL Definition

```
datum_option = 
  [ 0, datum_hash : $hash32 ]  // Hash of the datum
  / [ 1, datum : plutus_data ] // Inline datum (Babbage+)
  / [ 2 ]                      // No datum

script_reference = 
  [ 0, native_script ]        // Reference to a native script
  / [ 1, plutus_v1_script ]   // Reference to a Plutus V1 script
  / [ 2, plutus_v2_script ]   // Reference to a Plutus V2 script
  / [ 3, plutus_v3_script ]   // Reference to a Plutus V3 script (Conway+)
```

### Using Datums and Script References in Argus

Chrysalis provides extension methods for working with datums and script references:

```csharp
foreach (var output in tx.Outputs())
{
    // Check for and access datums
    if (output.HasDatum())
    {
        if (output.HasInlineDatum())
        {
            var inlineDatum = output.InlineDatum();
            
            // Process the inline datum based on its structure
            if (inlineDatum.IsConstr())
            {
                // Constructor structure (common for custom types)
                var constr = inlineDatum.AsConstr();
                var tag = constr.Tag();        // Type identifier
                var fields = constr.Fields();  // Field values
                // Process constructor fields
            }
            else if (inlineDatum.IsList())
            {
                // List structure
                var list = inlineDatum.AsList();
                // Process list items
            }
            // Handle other Plutus data types (integers, bytes, maps)
        }
        else
        {
            // Only the datum hash is available
            string datumHash = output.DatumHash();
            // Process the datum hash (you might need to look up the actual datum)
        }
    }
    
    // Check for and access script references
    if (output.HasScriptRef())
    {
        var scriptRef = output.ScriptRef();
        
        if (scriptRef.IsNativeScript())
        {
            // Process native script (multi-sig, timelock)
            var nativeScript = scriptRef.AsNativeScript();
            
            switch (nativeScript.Type())
            {
                case NativeScriptType.ScriptPubkey:
                    // Single-signature script
                    var keyHash = nativeScript.AsScriptPubkey().KeyHash();
                    // Process pubkey script
                    break;
                    
                case NativeScriptType.ScriptAll:
                    // AND condition (all scripts must pass)
                    var allScripts = nativeScript.AsScriptAll().Scripts();
                    // Process all-of scripts
                    break;
                    
                // Handle other native script types
            }
        }
        else if (scriptRef.IsPlutusScript())
        {
            // Process Plutus script (smart contract)
            var plutusScript = scriptRef.AsPlutusScript();
            var version = plutusScript.Version(); // 1, 2, or 3
            byte[] scriptBytes = plutusScript.Bytes();
            // Process Plutus script
        }
    }
}
```

:::warning Datum Handling
When tracking script-related UTxOs, be careful with datum handling:
1. For hash-only datums, you'll need to find the actual datum data in the transaction that spends the UTxO
2. Inline datums are directly accessible but might be complex Plutus data structures
3. Different contracts use different datum formats, so you may need contract-specific parsing logic
:::

### Important Datum/Script Fields and Extension Methods

| Type | Extension Method | Description |
|------|------------------|-------------|
| Datum | `output.HasDatum()` | Check if the output has a datum |
| Datum | `output.HasInlineDatum()` | Check if the output has an inline datum |
| Datum | `output.InlineDatum()` | Get the inline datum |
| Datum | `output.DatumHash()` | Get the datum hash |
| Script | `output.HasScriptRef()` | Check if the output has a script reference |
| Script | `output.ScriptRef()` | Get the script reference |

&nbsp;

Script-specific methods:

&nbsp;


| Method | Description |
|--------|-------------|
| `scriptRef.IsNativeScript()` | Check if it's a native script |
| `scriptRef.IsPlutusScript()` | Check if it's a Plutus script |
| `scriptRef.AsNativeScript()` | Get as native script |
| `scriptRef.AsPlutusScript()` | Get as Plutus script |
| `plutusScript.Version()` | Get Plutus language version |
| `plutusScript.Bytes()` | Get raw script bytes |

## 💰 Withdrawals

Withdrawals represent the claiming of staking rewards from the reward account to a regular address.

&nbsp;

:::info Reward System
In Cardano, staking rewards don't automatically appear in your wallet. They accumulate in special reward accounts (identified by stake credentials) and must be explicitly withdrawn via transactions containing withdrawal entries.
:::

### What are Withdrawals?

Withdrawals allow stake address owners to:
- Claim accumulated staking rewards from delegation
- Access pledge returns for pool operators
- Retrieve treasury funds (in Conway era governance)

<details>
<summary>The Withdrawal Mechanism</summary>

The withdrawal process works as follows:

1. Rewards accumulate in a reward account associated with a stake credential
2. A transaction includes a withdrawal entry for that stake credential
3. The specified amount is transferred from the reward account to a transaction output
4. The reward account balance is reduced accordingly

Withdrawals require a signature from the stake credential's private key to prevent unauthorized access to rewards.
</details>

### CDDL Definition

```
withdrawals = { + reward_account => coin }
```

Each entry maps a reward account (stake credential address) to a coin amount (lovelace).

### Using Withdrawals in Argus

Chrysalis provides extension methods for working with withdrawals:

```csharp
if (tx.HasWithdrawals())
{
    var withdrawals = tx.Withdrawals();
    
    // Process each withdrawal
    foreach (var withdrawal in withdrawals)
    {
        string stakeAddress = withdrawal.Key();  // Stake address withdrawing from
        ulong amount = withdrawal.Value();       // Amount in lovelace being withdrawn
        
        // Process the withdrawal
        // Example: Track reward withdrawals by address
        using var db = await dbContextFactory.CreateDbContextAsync();
        db.StakeRewards.Add(new StakeReward(
            Slot = slot,
            StakeAddress = stakeAddress,
            Amount = amount,
            TxHash = txHash
        ));
    }
}
```

:::tip Withdrawal Analytics
Tracking withdrawals can provide valuable insights for:
- **Reward analytics** platforms showing earnings history
- **Staking dashboards** calculating actual claimed vs. unclaimed rewards
- **Tax tools** that need to identify reward income events
- **Pool performance** metrics combining delegation and reward data
:::

### Important Withdrawal Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| reward_account | `withdrawal.Key()` | Get the stake address |
| coin | `withdrawal.Value()` | Get the withdrawal amount |

&nbsp;

Additional useful methods:

&nbsp;


| Method | Description |
|--------|-------------|
| `tx.HasWithdrawals()` | Check if the transaction has withdrawals |
| `tx.Withdrawals()` | Get all withdrawals in the transaction |

## 🏷️ Metadata

Transaction metadata allows attaching arbitrary data to transactions, enabling a rich ecosystem of off-chain applications and integrations.

&nbsp;

:::info Beyond The Ledger
Metadata doesn't affect transaction validation or the ledger state. It's a place to store information that needs blockchain permanence but doesn't directly relate to token transfers or script execution.
:::

### What is Metadata?

Metadata is additional information attached to a transaction that:
- Doesn't affect transaction validation
- Is stored permanently on the blockchain
- Can be used for various purposes:

| Use Case | Common Labels | Description |
|----------|---------------|-------------|
| NFT Properties | 721 (CIP-25) | Asset attributes, images, names |
| Social Media | 1587-1589 | Decentralized social posts |
| Document Notarization | Various | Document hashes and timestamps |
| DApp-specific Data | Various | Application state and events |
| Voting Records | Various | Governance votes and proposals |

<details>
<summary>Metadata Structure and Standards</summary>

Metadata uses a flexible, hierarchical structure:
- **Labels**: Integer identifiers for different metadata types
- **Values**: Structured content (integers, strings, bytes, arrays, maps)

Several community standards define common metadata formats:
- **CIP-25**: NFT Metadata Standard
- **CIP-20**: Transaction Message/Comment Metadata
- **CIP-13**: Cardano Address Metadata Pointer
</details>

### CDDL Definition

```
metadata = { * transaction_metadata_label => transaction_metadata_value }

transaction_metadata_value =
    int                                 ; Integer values
  / bytes                               ; Binary data
  / text                                ; UTF-8 text strings
  / [* transaction_metadata_value]      ; Arrays of metadata values
  / { * transaction_metadata_value => transaction_metadata_value } ; Maps
  / metadata_map                        ; Special map structures
```

### Using Metadata in Argus

Chrysalis provides extension methods for working with transaction metadata:

```csharp
var auxDataSet = block.AuxiliaryDataSet();
    
// Process metadata by transaction hash (key) and metadata object (value)
foreach (var entry in auxDataSet)
{
    string txHash = entry.Key();       // Transaction hash
    var metadata = entry.Value();      // All metadata for this transaction
    
    // Process metadata by label
    foreach (var labelEntry in metadata)
    {
        uint label = labelEntry.Key();  // Metadata label (number)
        var value = labelEntry.Value(); // Metadata value (complex structure)
        
        // Process specific metadata types
        if (label == 721) // CIP-25 NFT Metadata
        {
            if (value.IsMap())
            {
                var nftMetadata = value.AsMap();
                // Process NFT metadata according to CIP-25
            }
        }
        
        // Process based on value type
        if (value.IsInt())
        {
            long intValue = value.AsInt();
            // Process integer metadata
        }
        else if (value.IsString())
        {
            string strValue = value.AsString();
            // Process string metadata
        }
        else if (value.IsList())
        {
            var listValue = value.AsList();
            // Process list metadata
        }
        else if (value.IsMap())
        {
            var mapValue = value.AsMap();
            // Process map metadata
        }
    }
}
```

:::tip Metadata-Aware Applications
Consider building specialized indexers for common metadata types:
- **NFT marketplaces** tracking CIP-25 metadata for display and search
- **Social platforms** aggregating posts from metadata
- **Document verification** systems monitoring notarized document hashes
- **DAO dashboards** analyzing governance-related metadata

These applications can extract specific metadata patterns and make them searchable in ways the blockchain itself doesn't support.
:::

### Important Metadata Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| metadata_label | `entry.Key()` | Get the metadata label |
| metadata_value | `entry.Value()` | Get the metadata value |

&nbsp;

Value-specific methods:

| Method | Description |
|--------|-------------|
| `value.IsInt()` | Check if value is an integer |
| `value.IsBytes()` | Check if value is bytes |
| `value.IsString()` | Check if value is a string |
| `value.IsList()` | Check if value is a list |
| `value.IsMap()` | Check if value is a map |
| `value.AsInt()` | Get value as an integer |
| `value.AsBytes()` | Get value as bytes |
| `value.AsString()` | Get value as a string |
| `value.AsList()` | Get value as a list |
| `value.AsMap()` | Get value as a map |

## 🪙 Minting

Minting is the process of creating or destroying native tokens in Cardano, one of the blockchain's most powerful features for assets beyond ADA.

&nbsp;

:::info Native Assets
Unlike many blockchains that require smart contracts for tokens, Cardano supports native multi-assets directly in the protocol. This means tokens have the same security, execution efficiency, and ease of use as ADA itself.
:::

### What is Minting?

Minting allows for:
- **Creating new tokens** (positive quantities)
- **Burning existing tokens** (negative quantities)
- **Implementing custom token policies** (via scripts)

Each policy is controlled by a script (native or Plutus) whose hash serves as the policy ID. This script defines the conditions under which tokens can be minted or burned.

&nbsp;

<details>
<summary>Minting Mechanics</summary>

The minting process works as follows:

1. A transaction includes a mint field with policy IDs, asset names, and quantities
2. The transaction must include and satisfy the corresponding policy scripts
3. When executed, the specified tokens are created or destroyed
4. The resulting tokens typically appear in transaction outputs

Unlike many blockchains with fixed token supplies, Cardano allows policy-controlled token inflation or deflation through minting and burning operations.
</details>

### CDDL Definition

```
mint = { + policy_id => { + asset_name => int64 } }
```

Where:
- `policy_id` is the hash of the minting policy script
- `asset_name` is a byte string (up to 32 bytes) identifying the asset
- `int64` quantity value indicates:
  - Positive values = token creation
  - Negative values = token burning (destruction)

### Using Minting in Argus

Chrysalis provides extension methods for working with token minting:

```csharp
if (tx.HasMint())
{
    var mint = tx.Mint();
    
    // Process each policy
    foreach (var policy in mint)
    {
        string policyId = policy.Key();     // Policy ID (script hash)
        var assets = policy.Value();        // Assets under this policy
        
        // Process each asset within the policy
        foreach (var asset in assets)
        {
            byte[] assetNameBytes = asset.Key();   // Asset name as bytes
            string assetNameHex = BytesToHex(assetNameBytes);  // Hex representation
            string assetNameUtf8 = TryDecodeUtf8(assetNameBytes);  // Text if valid UTF-8
            long quantity = asset.Value();         // Amount minted (+ create, - burn)
            
            if (quantity > 0)
            {
                // Token minting operation
                Console.WriteLine($"Minted {quantity} of {policyId}.{assetNameHex}");
            }
            else if (quantity < 0)
            {
                // Token burning operation
                Console.WriteLine($"Burned {-quantity} of {policyId}.{assetNameHex}");
            }
            
            // Store minting operation in database
            using var db = await dbContextFactory.CreateDbContextAsync();
            db.TokenEvents.Add(new TokenEvent(
                Slot = slot,
                BlockNumber = blockNumber,
                TxHash = txHash,
                PolicyId = policyId,
                AssetName = assetNameHex,
                Quantity = quantity
            ));
        }
    }
}

// Helper methods
private string BytesToHex(byte[] bytes)
{
    return BitConverter.ToString(bytes).Replace("-", "").ToLowerInvariant();
}

private string TryDecodeUtf8(byte[] bytes)
{
    try
    {
        return Encoding.UTF8.GetString(bytes);
    }
    catch
    {
        return null; // Not valid UTF-8
    }
}
```

:::tip Token-Tracking Applications
Minting tracking enables powerful applications:
- **Token explorers** showing creation/burn events and circulating supply
- **NFT platforms** detecting mints of new collections
- **Asset dashboards** monitoring token distribution and activity
- **Market analytics** correlating price with mint/burn events

Consider using CIP-14 asset fingerprints for standardized token identification across your application.
:::

### Important Minting Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| policy_id | `policy.Key()` | Get the policy ID |
| asset_name | `asset.Key()` | Get the asset name (bytes) |
| int64 | `asset.Value()` | Get the minting quantity |

&nbsp;

Additional useful methods:

| Method | Description |
|--------|-------------|
| `tx.HasMint()` | Check if the transaction mints/burns tokens |
| `tx.Mint()` | Get the minting information |

## 🛠️ Creating Reducers for Cardano Data

When building Argus reducers to process these Cardano structures, follow this pattern:

```csharp
public class MyReducer : IReducer<MyModel>
{
    private readonly IDbContextFactory<MyDbContext> _dbContextFactory;
    
    public MyReducer(IDbContextFactory<MyDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }
    
    public async Task RollForwardAsync(Block block)
    {
        // Extract block-level data
        string blockHash = block.Header().Hash();
        ulong blockNumber = block.Header().HeaderBody().BlockNumber();
        ulong slot = block.Header().HeaderBody().Slot();
        
        using var db = await _dbContextFactory.CreateDbContextAsync();
        
        // Process transactions
        foreach (var tx in block.TransactionBodies())
        {
            // Extract and process transaction data
            string txHash = tx.Hash();
            
            // Access other components as needed
            // ...
            
            // Store in database
            db.MyModels.Add(new MyModel(
                // Populate model properties
            ));
        }
        
        await db.SaveChangesAsync();
    }
    
    public async Task RollBackwardAsync(ulong slot)
    {
        // Handle rollbacks for data consistency
        using var db = await _dbContextFactory.CreateDbContextAsync();
        
        // Remove data from slots ≥ the rollback point
        db.MyModels.RemoveRange(
            db.MyModels.Where(m => m.Slot >= slot)
        );
        
        await db.SaveChangesAsync();
    }
}
```

:::important Rollback Handling
Always implement proper `RollBackwardAsync` logic. Chain reorganizations can happen in Cardano, and your indexer must be able to reliably "undo" the effects of blocks that are no longer part of the canonical chain.
:::

By understanding these Cardano data structures and how to access them in Argus (via Chrysalis), you can build sophisticated indexers that extract and transform blockchain data according to your application's needs.
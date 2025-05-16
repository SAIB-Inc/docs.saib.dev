---
title: Cardano Data Structures
sidebar_position: 1
---

# 📊 Cardano Data Structures

This document explains the Cardano blockchain data structures exposed in Argus and how they map to the official CDDL specification. Understanding these structures is essential for building effective reducers that can extract and process blockchain data.

## 🔍 Introduction

Cardano uses CBOR (Concise Binary Object Representation) for serializing blockchain data and CDDL (Concise Data Definition Language) to specify the format of this data. Argus leverages the Chrysalis library, which provides strongly-typed C# representations of Cardano data structures.

The Chrysalis library handles the complex CBOR serialization/deserialization process, providing easy-to-use extension methods that let you work with Cardano data in an object-oriented way.

## 📦 Block Structure

Blocks are the fundamental units of the Cardano blockchain, containing a header and multiple transactions.

### What is a Block?

A block in Cardano contains:
- A header with metadata about the block
- A set of transaction bodies
- Transaction witness sets (signatures and validation data)
- Auxiliary data (metadata)
- Invalid transactions (if any)

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

Transactions are the primary mechanism for state changes in Cardano, representing the transfer of assets, execution of smart contracts, and various other operations.

### What is a Transaction?

A Cardano transaction consists of:
- Inputs (references to UTXOs being spent)
- Outputs (new UTXOs being created)
- Fee
- Various optional components (certificates, withdrawals, metadata, etc.)

### CDDL Definition

The core transaction structure in CDDL (simplified):

```
transaction_body =
  { 0 : set<transaction_input>    ; inputs
  , 1 : [* transaction_output]    ; outputs
  , 2 : coin                      ; fee
  , ? 3 : uint                    ; ttl
  , ? 4 : [* certificate]         ; certificates
  , ? 5 : withdrawals             ; rewards withdrawals
  , ? 6 : update                  ; update proposal
  , ? 7 : auxiliary_data_hash     ; metadata hash
  , ? 8 : uint                    ; validity interval start
  , ? 9 : uint                    ; validity interval end
  , ? 11 : [* addr_keyhash]       ; required signers
  , ? 13 : set<transaction_input> ; collateral inputs
  , ? 14 : [* plutus_script]      ; collateral return
  , ? 15 : coin                   ; total collateral
  , ? 16 : set<transaction_input> ; reference inputs
  ; ... more fields in newer eras
  }
```

### Using Transactions in Argus

Chrysalis provides extension methods for accessing transaction data regardless of era:

```csharp
foreach (var tx in block.TransactionBodies())
{
    // Basic transaction information
    string txHash = tx.Hash();
    ulong fee = tx.Fee();
    
    // Access transaction components
    var inputs = tx.Inputs();
    var outputs = tx.Outputs();
    
    // Check for and access optional components
    if (tx.HasCertificates())
    {
        var certificates = tx.Certificates();
        // Process certificates
    }
    
    if (tx.HasWithdrawals())
    {
        var withdrawals = tx.Withdrawals();
        // Process withdrawals
    }
    
    if (tx.HasMint())
    {
        var mint = tx.Mint();
        // Process token minting/burning
    }
    
    // Get raw transaction bytes (if available)
    byte[] rawTx = tx.Raw?.ToArray() ?? [];
    
    // Store transaction data in database
    // ...
}
```

### Important Transaction Fields and Extension Methods

| CDDL Field | Extension Method | Description |
|------------|------------------|-------------|
| 0: inputs | `tx.Inputs()` | Get transaction inputs |
| 1: outputs | `tx.Outputs()` | Get transaction outputs |
| 2: fee | `tx.Fee()` | Get transaction fee in lovelace |
| 3: ttl | `tx.ValidTo()` | Get transaction time-to-live |
| 4: certificates | `tx.Certificates()` | Get certificates |
| 5: withdrawals | `tx.Withdrawals()` | Get reward withdrawals |
| 7: metadata_hash | `tx.AuxiliaryDataHash()` | Get metadata hash |
| 8: validity_interval_start | `tx.ValidFrom()` | Get validity start (slot) |
| 9: script_data_hash | `tx.ScriptDataHash()` | Get script data hash |
| 11: required_signers | `tx.RequiredSigners()` | Get required signers |
| 13: collateral_inputs | `tx.Collateral()` | Get collateral inputs |
| 16: reference_inputs | `tx.ReferenceInputs()` | Get reference inputs |

&nbsp;

Additional useful transaction methods:

&nbsp;


| Method | Description |
|--------|-------------|
| `tx.Hash()` | Get the transaction hash |
| `tx.HasMetadata()` | Check if the transaction has metadata |
| `tx.HasMint()` | Check if the transaction mints/burns tokens |
| `tx.HasCertificates()` | Check if transaction has certificates |
| `tx.HasWithdrawals()` | Check if transaction has withdrawals |
| `tx.HasReferenceInputs()` | Check if the transaction has reference inputs |
| `tx.Raw?.ToArray()` | Get the raw transaction bytes (if available) |

## 🔗 Inputs and UTXOs

Cardano uses an extended UTXO model where the state is represented as a collection of Unspent Transaction Outputs (UTXOs).

### What are Inputs and UTXOs?

- **Input**: Reference to a UTXO being spent (transaction ID + output index)
- **UTXO**: Unspent Transaction Output, representing a "coin" that can be spent
- **Output**: New UTXO created by a transaction

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

### Using Inputs and UTXOs in Argus

Chrysalis provides extension methods for transaction inputs and outputs:

```csharp
// Processing inputs (UTXOs being spent)
foreach (var input in tx.Inputs())
{
    string txId = input.TxId();
    uint index = input.Index();
    
    // Combine to form a unique UTXO reference
    string utxoRef = $"{txId}#{index}";
}

// Processing outputs (new UTXOs being created)
foreach (var output in tx.Outputs())
{
    string address = output.Address();
    ulong adaAmount = output.Amount();
    
    // Process multi-asset outputs
    if (output.HasMultiAsset())
    {
        var multiAsset = output.MultiAsset();
        foreach (var policy in multiAsset)
        {
            string policyId = policy.Key();
            var assets = policy.Value();
            
            foreach (var asset in assets)
            {
                byte[] assetName = asset.Key();
                ulong quantity = asset.Value();
                
                // Process each asset in the UTXO
            }
        }
    }
    
    // Process script-locked outputs
    if (output.HasDatum())
    {
        if (output.HasInlineDatum())
        {
            var datum = output.InlineDatum();
            // Process inline datum
        }
        else
        {
            string datumHash = output.DatumHash();
            // Process datum hash
        }
    }
    
    if (output.HasScriptRef())
    {
        var scriptRef = output.ScriptRef();
        // Process script reference
    }
}
```

### Important Input/UTXO Fields and Extension Methods

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

Certificates are special transaction components that perform various operations in the Cardano system, particularly related to staking and governance.

### What are Certificates?

Certificates are used for:
- Registering and deregistering stake addresses
- Delegating stake to pools
- Registering and retiring stake pools
- Governance actions (in newer eras)

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
                // Process stake registration
                break;
                
            case CertificateType.StakeDeregistration:
                var deregKeyHash = cert.StakeDeregistration().KeyHash();
                // Process stake deregistration
                break;
                
            case CertificateType.StakeDelegation:
                var delegator = cert.StakeDelegation().KeyHash();
                var poolId = cert.StakeDelegation().PoolHash();
                // Process delegation certificate
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
                // Process pool registration
                break;
                
            case CertificateType.PoolRetirement:
                var retiringPoolId = cert.PoolRetirement().PoolKeyHash();
                var retirementEpoch = cert.PoolRetirement().Epoch();
                // Process pool retirement
                break;
                
            // Handle other certificate types
        }
    }
}
```

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

Datums and script references are critical components for smart contract functionality in Cardano.

### What are Datums and Script References?

- **Datum**: Data attached to a UTXO, used for script validation
- **Script Reference**: Reference to a script that defines spending conditions

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
            
            // Process the inline datum
            // For example, if it's a Plutus Data structure:
            if (inlineDatum.IsConstr())
            {
                var constr = inlineDatum.AsConstr();
                var tag = constr.Tag();
                var fields = constr.Fields();
                // Process constructor fields
            }
            else if (inlineDatum.IsList())
            {
                var list = inlineDatum.AsList();
                // Process list items
            }
            // Handle other Plutus data types
        }
        else
        {
            string datumHash = output.DatumHash();
            // Process the datum hash
        }
    }
    
    // Check for and access script references
    if (output.HasScriptRef())
    {
        var scriptRef = output.ScriptRef();
        
        if (scriptRef.IsNativeScript())
        {
            var nativeScript = scriptRef.AsNativeScript();
            // Process native script
            
            switch (nativeScript.Type())
            {
                case NativeScriptType.ScriptPubkey:
                    var keyHash = nativeScript.AsScriptPubkey().KeyHash();
                    // Process pubkey script
                    break;
                    
                case NativeScriptType.ScriptAll:
                    var allScripts = nativeScript.AsScriptAll().Scripts();
                    // Process all-of scripts
                    break;
                    
                // Handle other native script types
            }
        }
        else if (scriptRef.IsPlutusScript())
        {
            var plutusScript = scriptRef.AsPlutusScript();
            var version = plutusScript.Version(); // 1, 2, or 3
            byte[] scriptBytes = plutusScript.Bytes();
            // Process Plutus script
        }
    }
}
```

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

### What are Withdrawals?

Withdrawals allow stake address owners to claim their accumulated rewards (from delegation or pledge rewards).

### CDDL Definition

```
withdrawals = { + reward_account => coin }
```

### Using Withdrawals in Argus

Chrysalis provides extension methods for working with withdrawals:

```csharp
if (tx.HasWithdrawals())
{
    var withdrawals = tx.Withdrawals();
    
    // Process each withdrawal
    foreach (var withdrawal in withdrawals)
    {
        string stakeAddress = withdrawal.Key();
        ulong amount = withdrawal.Value();
        
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

Transaction metadata allows attaching arbitrary data to transactions, enabling various off-chain applications.

### What is Metadata?

Metadata is additional information attached to a transaction that doesn't affect validation. It's commonly used for:
- NFT properties
- Social media content
- Application-specific data
- Integration with off-chain systems

### CDDL Definition

```
metadata = { * transaction_metadata_label => transaction_metadata_value }

transaction_metadata_value =
    int
  / bytes
  / text
  / [* transaction_metadata_value]
  / { * transaction_metadata_value => transaction_metadata_value }
  / metadata_map
```

### Using Metadata in Argus

Chrysalis provides extension methods for working with transaction metadata:

```csharp
if (tx.HasMetadata())
{
    var metadata = tx.Metadata();
    
    // Process metadata by label
    foreach (var entry in metadata)
    {
        ulong label = entry.Key();
        var value = entry.Value();
        
        // Handle specific metadata labels
        switch (label)
        {
            case 674: // Stake pool metadata
                // Process pool metadata
                break;
                
            case 721: // NFT metadata (CIP-25)
                if (value.IsMap())
                {
                    var nftData = value.AsMap();
                    
                    // Extract NFT information
                    foreach (var policyEntry in nftData)
                    {
                        string policyId = policyEntry.Key().AsString();
                        var assets = policyEntry.Value().AsMap();
                        
                        foreach (var assetEntry in assets)
                        {
                            string assetName = assetEntry.Key().AsString();
                            var assetDetails = assetEntry.Value().AsMap();
                            
                            // Extract name, description, image, etc.
                            string name = assetDetails["name"]?.AsString();
                            string description = assetDetails["description"]?.AsString();
                            string image = assetDetails["image"]?.AsString();
                            
                            // Process NFT metadata
                        }
                    }
                }
                break;
                
            case 20: // Message metadata
                string message = value.AsString();
                // Process message
                break;
                
            // Handle other metadata labels
        }
    }
}
```

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

Minting is the process of creating or destroying native tokens in Cardano.

### What is Minting?

Minting allows for:
- Creating new native tokens
- Burning existing tokens
- Implementing custom token policies

Each policy is controlled by a script (the policy script) whose hash serves as the policy ID.

### CDDL Definition

```
mint = { + policy_id => { + asset_name => int64 } }
```

Where:
- Positive values indicate token creation
- Negative values indicate token burning (destruction)

### Using Minting in Argus

Chrysalis provides extension methods for working with token minting:

```csharp
if (tx.HasMint())
{
    var mint = tx.Mint();
    
    // Process each policy
    foreach (var policy in mint)
    {
        string policyId = policy.Key();
        var assets = policy.Value();
        
        // Process each asset within the policy
        foreach (var asset in assets)
        {
            byte[] assetNameBytes = asset.Key();
            string assetNameHex = BytesToHex(assetNameBytes);
            string assetNameUtf8 = TryDecodeUtf8(assetNameBytes);
            long quantity = asset.Value();
            
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

By understanding these Cardano data structures and how to access them in Argus (via Chrysalis), you can build sophisticated indexers that extract and transform blockchain data according to your application's needs.

&nbsp;

## 🔍 Next Steps

Now that you understand the core Cardano data structures in Argus, you might want to explore:

- [General Reducers](../reducers/general/index.md): Common reducer patterns for Cardano data
- [dApp Reducers](../reducers/dapp/index.md): Specialized reducers for decentralized applications
- [Building APIs](../api-integration/index.md): Creating APIs with your indexed data
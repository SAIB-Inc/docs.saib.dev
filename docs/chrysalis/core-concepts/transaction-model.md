---
title: Transaction Model
sidebar_position: 2
hide_title: true
---

# Transaction Model

Cardano's Extended UTxO (EUTxO) model forms the foundation of all value transfer on the blockchain. This guide explores how Chrysalis implements comprehensive transaction building capabilities, providing developers with powerful tools to construct, sign, and submit transactions across all Cardano eras.

---

## Understanding UTxO

The Unspent Transaction Output (UTxO) model treats blockchain state as a collection of unspent outputs from previous transactions. Unlike account-based models, UTxOs are immutable—they can only be consumed entirely and new UTxOs created as outputs.

### Key Concepts

- **UTxO** - An unspent output containing value (ADA and/or tokens) locked by an address
- **Transaction Input** - References a UTxO to be consumed
- **Transaction Output** - Creates new UTxOs with specified values and addresses
- **Transaction** - Consumes inputs and produces outputs, maintaining value conservation

### Extended UTxO (EUTxO)

Cardano extends the basic UTxO model with additional capabilities:

- **Datum** - Arbitrary data attached to outputs for smart contract state
- **Redeemer** - Data provided when consuming script-locked UTxOs
- **Script Context** - Transaction information available to validators
- **Reference Inputs** - Read UTxOs without consuming them

---

## Transaction Structure

A Cardano transaction consists of several components working together to ensure validity and security.

### Core Components

```csharp
using Chrysalis.Tx;

// Transaction structure in Chrysalis
public class Transaction
{
    public TransactionBody Body { get; set; }
    public WitnessSet Witnesses { get; set; }
    public bool IsValid { get; set; }
    public AuxiliaryData? Metadata { get; set; }
}
```

### Transaction Body

The transaction body contains the essential data:

```csharp
public class TransactionBody
{
    // Inputs and Outputs
    public List<TransactionInput> Inputs { get; set; }
    public List<TransactionOutput> Outputs { get; set; }
    
    // Fees and Validity
    public ulong Fee { get; set; }
    public ulong? Ttl { get; set; }  // Time to live
    public ValidityInterval? ValidityInterval { get; set; }
    
    // Multi-asset and Scripts
    public List<Certificate>? Certificates { get; set; }
    public Withdrawals? Withdrawals { get; set; }
    public Update? Update { get; set; }
    public ScriptDataHash? ScriptDataHash { get; set; }
    
    // Collateral for smart contracts
    public List<TransactionInput>? Collateral { get; set; }
    public List<Ed25519KeyHash>? RequiredSigners { get; set; }
    
    // Babbage era additions
    public List<TransactionInput>? ReferenceInputs { get; set; }
}
```

### Witness Set

Contains all signatures and scripts required to validate the transaction:

```csharp
public class WitnessSet
{
    public List<VKeyWitness>? VKeyWitnesses { get; set; }
    public List<NativeScript>? NativeScripts { get; set; }
    public List<PlutusScript>? PlutusV1Scripts { get; set; }
    public List<PlutusScript>? PlutusV2Scripts { get; set; }
    public List<PlutusData>? PlutusData { get; set; }
    public List<Redeemer>? Redeemers { get; set; }
}
```

---

## Building Transactions

Chrysalis offers a flexible and intuitive API for constructing Cardano transactions, accommodating both simple transfers and complex multi-party operations. Whether you need fine-grained control with low-level builders or prefer the convenience of high-level templates, Chrysalis provides the tools to efficiently create transactions that comply with Cardano's ledger rules across all eras.

### Basic Transaction Building

Create a simple ADA transfer transaction:

```csharp
using Chrysalis.Tx;

// Create transaction builder
var builder = new TransactionBuilder();

// Add inputs (UTxOs to consume)
builder.AddInput(new TransactionInput
{
    TransactionId = previousTxHash,
    Index = 0
});

// Add outputs (new UTxOs to create)
builder.AddOutput(new TransactionOutput
{
    Address = recipientAddress,
    Amount = new Value { Coin = 5_000_000 } // 5 ADA
});

// Set fee (calculate based on transaction size)
builder.SetFee(200_000); // 0.2 ADA

// Add change output
var changeAmount = inputAmount - 5_000_000 - 200_000;
builder.AddOutput(new TransactionOutput
{
    Address = changeAddress,
    Amount = new Value { Coin = changeAmount }
});

// Build transaction body
var txBody = builder.Build();
```

### Transaction Template Builder

For more complex scenarios, use the template builder:

```csharp
// Define a transfer template
var transferTemplate = TransactionTemplateBuilder<TransferParams>
    .Create(provider)
    .AddStaticParty("sender", senderAddress, isSigner: true)
    .AddStaticParty("receiver", receiverAddress)
    .AddInput((options, params) => 
    {
        options.From = "sender";
        options.MinLovelace = params.Amount + 1_000_000; // Amount + fees
    })
    .AddOutput((options, params) => 
    {
        options.To = "receiver";
        options.Amount = new Lovelace(params.Amount);
    })
    .Build();

// Execute template
var tx = await transferTemplate(new TransferParams { Amount = 10_000_000 });
```

### Multi-Asset Transactions

Handle native tokens alongside ADA:

```csharp
// Create multi-asset value
var multiAssetValue = new Value
{
    Coin = 2_000_000, // 2 ADA
    MultiAsset = new NativeAsset
    {
        [policyId] = new TokenBundle
        {
            ["TokenA"] = 100,
            ["TokenB"] = 50,
            ["NFT001"] = 1
        }
    }
};

// Add multi-asset output
builder.AddOutput(new TransactionOutput
{
    Address = recipientAddress,
    Amount = multiAssetValue
});
```

---

## Smart Contract Transactions

Building on Cardano's Extended UTxO model, Chrysalis simplifies the complexity of smart contract interactions by providing type-safe abstractions for script outputs, redeemers, and validators. This section demonstrates how to create transactions that lock funds in scripts, consume script-protected UTxOs with proper redeemers, and leverage Babbage-era features like reference scripts and inline datums for optimized on-chain operations.

### Script Outputs

Create outputs locked by scripts:

```csharp
// Create script address
var scriptAddress = Address.FromScript(
    NetworkType.Mainnet,
    scriptHash
);

// Add output with datum
builder.AddOutput(new TransactionOutput
{
    Address = scriptAddress,
    Amount = new Value { Coin = 10_000_000 },
    DatumOption = new DatumOption
    {
        Datum = InlineDatum.From(myDatum) // Inline datum (Babbage+)
    }
});
```

### Consuming Script UTxOs

Provide redeemers when spending from scripts:

```csharp
// Add collateral input (required for script transactions)
builder.AddCollateral(collateralInput);

// Add script input with redeemer
builder.AddInput(scriptInput);
builder.AddRedeemer(new Redeemer
{
    Tag = RedeemerTag.Spend,
    Index = 0, // Input index
    Data = PlutusData.FromCbor(redeemerData),
    ExUnits = new ExUnits
    {
        Mem = 1_000_000,
        Steps = 1_000_000_000
    }
});

// Attach script (if not reference script)
builder.AttachPlutusScript(plutusScript);
```

### Reference Scripts

Use reference scripts to reduce transaction size:

```csharp
// Add reference input containing the script
builder.AddReferenceInput(new TransactionInput
{
    TransactionId = scriptRefTxHash,
    Index = 0
});

// No need to attach script in witness set
// Just provide redeemer for script execution
```

---

## Transaction Signing

Every Cardano transaction requires cryptographic signatures to prove ownership of the consumed UTxOs and authorize the transfer of funds. Chrysalis provides a straightforward signing API that handles both simple single-signature transactions and complex multi-signature scenarios, ensuring your transactions meet all witness requirements while maintaining the security of private keys throughout the signing process.

### Basic Signing

```csharp
// Create witness from private key
var txHash = txBody.GetHash();
var witness = new VKeyWitness
{
    VKey = privateKey.GetPublicKey(),
    Signature = privateKey.Sign(txHash)
};

// Create complete transaction
var signedTx = new Transaction
{
    Body = txBody,
    Witnesses = new WitnessSet
    {
        VKeyWitnesses = [witness]
    },
    IsValid = true
};
```

### Multi-Signature

For transactions requiring multiple signatures:

```csharp
// Collect signatures from all required signers
var witnesses = new List<VKeyWitness>();

foreach (var signer in requiredSigners)
{
    var witness = new VKeyWitness
    {
        VKey = signer.PublicKey,
        Signature = signer.Sign(txHash)
    };
    witnesses.Add(witness);
}

// Add all witnesses
signedTx.Witnesses.VKeyWitnesses = witnesses;
```

---

## Transaction Submission

Once a transaction is built and signed, it must be submitted to the Cardano network for inclusion in a block. Chrysalis supports multiple submission methods, from direct node communication using the local-tx-submission protocol to convenient provider-based APIs, giving you flexibility in how your application interacts with the blockchain while handling submission errors and confirmation tracking.

### Direct Node Submission

```csharp
using Chrysalis.Network;

// Connect to node
var client = await NodeClient.ConnectAsync("127.0.0.1", 3001);

// Submit transaction
try
{
    var txId = await client.LocalTxSubmission.SubmitAsync(
        signedTx.Serialize()
    );
    Console.WriteLine($"Transaction submitted: {txId.ToHex()}");
}
catch (TxSubmissionException ex)
{
    Console.WriteLine($"Submission failed: {ex.Message}");
}
```

### Provider-Based Submission

```csharp
// Using Blockfrost provider
var provider = new BlockfrostProvider(apiKey, network);

var txHash = await provider.SubmitTransactionAsync(signedTx);
Console.WriteLine($"Transaction hash: {txHash}");

// Monitor transaction
var confirmed = await provider.WaitForTransactionAsync(txHash);
```

---

## Common Patterns

Real-world Cardano applications often require patterns beyond basic transactions, such as efficient UTxO management, metadata attachment for NFTs and DApps, and batch processing for high-volume operations. These proven patterns demonstrate how to leverage Chrysalis's capabilities to build robust, production-ready applications that handle complex scenarios while maintaining performance and reliability.

### UTxO Selection

Implement coin selection for optimal UTxO usage:

```csharp
public class CoinSelector
{
    public static List<UTxO> SelectCoins(
        List<UTxO> available, 
        Value required)
    {
        // Sort by value (largest first)
        var sorted = available.OrderByDescending(u => u.Value.Coin);
        
        var selected = new List<UTxO>();
        var accumulated = Value.Zero;
        
        foreach (var utxo in sorted)
        {
            selected.Add(utxo);
            accumulated = accumulated.Add(utxo.Value);
            
            if (accumulated.GreaterThanOrEqual(required))
                break;
        }
        
        return selected;
    }
}
```

### Transaction Metadata

Add metadata to transactions:

```csharp
// Create metadata
var metadata = new AuxiliaryData
{
    Metadata = new Dictionary<ulong, MetadataValue>
    {
        [674] = new MetadataMap
        {
            ["msg"] = new MetadataText("Hello Cardano!"),
            ["app"] = new MetadataText("MyDApp"),
            ["version"] = new MetadataInt(1)
        }
    }
};

// Add to transaction
signedTx.Metadata = metadata;
```

### Batch Transactions

Process multiple operations efficiently:

```csharp
public async Task<List<string>> BatchTransfer(
    List<TransferRequest> transfers)
{
    var txHashes = new List<string>();
    
    // Group by sender for efficiency
    var grouped = transfers.GroupBy(t => t.Sender);
    
    foreach (var group in grouped)
    {
        var builder = new TransactionBuilder();
        
        // Add all outputs for this sender
        foreach (var transfer in group)
        {
            builder.AddOutput(new TransactionOutput
            {
                Address = transfer.Recipient,
                Amount = new Value { Coin = transfer.Amount }
            });
        }
        
        // Build and submit
        var tx = await BuildAndSign(builder, group.Key);
        var hash = await SubmitTransaction(tx);
        txHashes.Add(hash);
    }
    
    return txHashes;
}
```

---

## Next Steps

- Learn about [Cardano Addresses](./cardano-addresses) for address generation
- Explore [Cryptographic Primitives](./cryptographic-primitives) for key management
- See [Transaction Building Guide](../modules/transaction-building) for advanced patterns
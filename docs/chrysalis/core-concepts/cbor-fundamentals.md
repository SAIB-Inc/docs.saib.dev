---
title: CBOR Fundamentals
sidebar_position: 1
hide_title: true
---

# CBOR Fundamentals

Understanding CBOR (Concise Binary Object Representation) is essential for working with Cardano, as it forms the foundation of all data serialization on the blockchain. This guide explores how Chrysalis implements CBOR to provide type-safe, high-performance serialization for Cardano applications.

---

## What is CBOR?

CBOR (Concise Binary Object Representation) is a binary data serialization format designed for small message size, extensibility, and simplicity. In the Cardano ecosystem, CBOR serves as the standard format for encoding all on-chain data structures, from simple transactions to complex smart contract parameters.

### Why Cardano Uses CBOR

Cardano chose CBOR for several compelling reasons:

- **Compact Size** - Binary encoding produces smaller payloads than JSON or XML
- **Self-Describing** - Data includes type information, enabling schema-less parsing
- **Deterministic** - Canonical CBOR ensures identical encoding for transaction hashing
- **Extensible** - Supports custom tags for Cardano-specific data types
- **Fast Processing** - Binary format enables efficient parsing and generation

---

## CBOR in Chrysalis

Chrysalis provides a powerful CBOR implementation specifically optimized for Cardano development. The `Chrysalis.Cbor` module offers attribute-based serialization that makes working with complex Cardano data structures intuitive and type-safe.

### Key Features

- **Attribute-Based Serialization** - Define serialization rules using simple C# attributes
- **Type Safety** - Compile-time validation prevents serialization errors
- **Performance Optimized** - Faster than native Rust implementations
- **Cardano-Specific** - Built-in support for all Cardano data types
- **Developer Friendly** - Intuitive API with helpful error messages

---

## Basic Concepts

### CBOR Data Types

CBOR supports several fundamental data types that map to Cardano structures:

| CBOR Type | Cardano Usage | C# Representation |
|-----------|---------------|-------------------|
| **Unsigned Integer** | Asset amounts, slots | `ulong`, `uint` |
| **Byte String** | Hashes, keys, scripts | `byte[]` |
| **Text String** | Metadata, asset names | `string` |
| **Array** | Transaction inputs/outputs | `List<T>`, `T[]` |
| **Map** | Metadata, multi-assets | `Dictionary<K,V>` |
| **Tagged** | Cardano-specific types | Custom classes |

### Cardano CBOR Tags

Cardano uses specific CBOR tags for blockchain data:

- **Tag 121** - Plutus script data constructors
- **Tag 122** - Plutus script lists
- **Tag 1280-1400** - Alternative constructors (6.121.0 - 6.127.255)

---

## Attribute-Based Serialization

Chrysalis uses attributes to define how your C# types serialize to CBOR:

### Basic Serialization

```csharp
using Chrysalis.Cbor;

[CborSerializable]
public partial record Transaction(
    [CborOrder(0)] TransactionBody Body,
    [CborOrder(1)] WitnessSet? Witnesses,
    [CborOrder(2)] bool IsValid,
    [CborOrder(3)] AuxiliaryData? Metadata
) : CborBase;
```

### Constructor Types

Use `[CborConstr]` for Plutus-style constructors:

```csharp
[CborSerializable]
[CborConstr(0)]  // Constructor index 0
public partial record ScriptContext(
    [CborOrder(0)] TxInfo TxInfo,
    [CborOrder(1)] ScriptPurpose Purpose
) : CborBase;

[CborSerializable]
[CborConstr(1)]  // Constructor index 1
public partial record Redeemer(
    [CborOrder(0)] byte[] Data
) : CborBase;
```

### List Types

For simple lists without constructor tags:

```csharp
[CborSerializable]
[CborList]
public partial record TransactionInputs(
    [CborOrder(0)] List<TransactionInput> Inputs
) : CborBase;
```

---

## Serialization Examples

This section demonstrates practical CBOR serialization patterns using Chrysalis, from basic type encoding to complex nested structures. These examples showcase the simplicity and power of attribute-based serialization, providing you with ready-to-use code snippets that can be adapted to your specific Cardano application needs.

### Basic Serialization

```csharp
// Define a token amount type
[CborSerializable]
[CborConstr(0)]
public partial record TokenAmount(
    [CborOrder(0)] byte[] PolicyId,
    [CborOrder(1)] byte[] AssetName,
    [CborOrder(2)] ulong Amount
) : CborBase;

// Create and serialize
var token = new TokenAmount(
    Convert.FromHexString("abcdef123456"),
    "MyNFT"u8.ToArray(),
    1
);

// Serialize to CBOR hex
string cborHex = token.SerializeToHex();
// Result: "d8799f46abcdef12345646..."

// Serialize to bytes
byte[] cborBytes = token.Serialize();
```

### Deserialization

```csharp
// From hex string
var hexData = "d8799f581cc05cb5c5f43aac9d9e057286e094f60d09ae61e8962ad5c42196180c9f4040ff1a00989680ff";
TokenAmount decoded = CborSerializer.Deserialize<TokenAmount>(hexData);

// From byte array
byte[] rawData = Convert.FromHexString(hexData);
TokenAmount fromBytes = CborSerializer.Deserialize<TokenAmount>(rawData);

// Access deserialized data
Console.WriteLine($"Amount: {decoded.Amount}");
Console.WriteLine($"Policy: {Convert.ToHexString(decoded.PolicyId)}");
```

### Complex Types

```csharp
[CborSerializable]
public partial record MultiAsset(
    [CborOrder(0)] Dictionary<byte[], Dictionary<byte[], ulong>> Assets
) : CborBase;

// Create complex multi-asset structure
var multiAsset = new MultiAsset(
    new Dictionary<byte[], Dictionary<byte[], ulong>>
    {
        [policyId1] = new Dictionary<byte[], ulong>
        {
            ["Token1"u8.ToArray()] = 100,
            ["Token2"u8.ToArray()] = 200
        },
        [policyId2] = new Dictionary<byte[], ulong>
        {
            ["NFT001"u8.ToArray()] = 1
        }
    }
);

// Serializes to nested CBOR maps
var cbor = multiAsset.Serialize();
```

---

## Advanced Features

Beyond basic serialization, Chrysalis provides advanced capabilities for specialized scenarios such as custom serialization logic, canonical encoding for cryptographic operations, and diagnostic tools for debugging. These features give you complete control over the serialization process while maintaining the safety and performance benefits of the Chrysalis framework.

### Custom Serialization

For types requiring custom logic, implement `ICborSerializable`:

```csharp
public class CustomAddress : ICborSerializable
{
    public byte[] Bytes { get; set; }
    
    public void Serialize(CborWriter writer)
    {
        // Custom serialization logic
        writer.WriteByteString(Bytes);
    }
    
    public static CustomAddress Deserialize(CborReader reader)
    {
        // Custom deserialization logic
        return new CustomAddress { Bytes = reader.ReadByteString() };
    }
}
```

### Canonical CBOR

For transaction hashing, use canonical encoding:

```csharp
// Canonical encoding ensures deterministic output
var canonicalBytes = CborSerializer.SerializeCanonical(transaction);
var txHash = Blake2b.Hash256(canonicalBytes);
```

### CBOR Diagnostics

Debug CBOR data using diagnostic notation:

```csharp
var diagnostic = CborSerializer.ToDiagnostic(cborBytes);
// Output: 121([h'abcdef123456', h'4d794e4654', 1])
```

---

## Common Patterns

### Transaction Serialization

```csharp
// Complete transaction serialization
var transaction = new Transaction(body, witnesses, true, metadata);
var cborBytes = transaction.Serialize();
var txId = Blake2b.Hash256(cborBytes);
```

### Script Data Serialization

```csharp
[CborSerializable]
[CborConstr(0)]
public partial record PlutusData(
    [CborOrder(0)] List<PlutusData> Fields
) : CborBase;

// Serialize complex script data
var scriptData = new PlutusData([
    new PlutusInteger(42),
    new PlutusByteString(pubKeyHash),
    new PlutusList([...])
]);
```

### Metadata Handling

```csharp
[CborSerializable]
public partial record TxMetadata(
    [CborOrder(0)] Dictionary<ulong, MetadataValue> Metadata
) : CborBase;

// Create transaction metadata
var metadata = new TxMetadata(new Dictionary<ulong, MetadataValue>
{
    [674] = new MetadataText("Hello Cardano!"),
    [675] = new MetadataMap(...)
});
```

---

## Next Steps

- Explore [Transaction Model](./transaction-model) to understand Cardano transactions
- Learn about [Cardano Addresses](./cardano-addresses) and their CBOR encoding
- See [CBOR Module Guide](../modules/cbor-handling) for advanced usage patterns
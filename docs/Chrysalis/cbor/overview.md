---
title: Overview
sidebar_position: 1
---

# Chrysalis.Cbor Overview

Chrysalis.Cbor is a robust, high-performance CBOR (Concise Binary Object Representation) serialization library tailored specifically for Cardano data structures within the .NET ecosystem. By leveraging source generators, Chrysalis.Cbor produces compile-time serializers and deserializers—eliminating reflection overhead and delivering optimal runtime performance.

Whether you’re building wallets, crafting transactions, or integrating on-chain metadata, Chrysalis.Cbor ensures your C# types map directly to Cardano’s CDDL-defined formats with minimal boilerplate.

---

## Why Chrysalis.Cbor?

- **Source-Generator Power**: Annotate your records with attributes like `[CborSerializable]`, `[CborList]`, and `[CborMap]` to automatically generate efficient serialization code at compile time.
- **Zero Reflection**: No runtime penalties—serialization logic is baked into your assembly, keeping dependencies lean and performance predictable.
- **Full CDDL Compliance**: Covers all core Cardano types (transactions, blocks, protocol parameters) and advanced patterns (indefinite lists, tagged values, unions, constructor types).
- **Built‑in Type Library**: Includes a comprehensive suite of CBOR types for Cardano core, protocol, script, and governance data.
- **Extensible & Customizable**: Easily define your own CBOR records, tags, and validation rules via `ICborValidator<T>`.

---

## Basic Usage

1. **Define your types**:
   ```csharp
   using Chrysalis.Cbor.Serialization.Attributes;
   using Chrysalis.Cbor.Types;

   [CborSerializable]
   [CborList]
   public partial record TransactionInput(
       [CborOrder(0)] byte[] TransactionId,
       [CborOrder(1)] ulong Index
   ) : CborBase;
   ```

2. **Serialize & Deserialize**
   ```csharp
   var input = new TransactionInput(txId, 0);
   byte[] cbor = CborSerializer.Serialize(input);
   var copy = CborSerializer.Deserialize<TransactionInput>(cbor);
   ```

That’s it—your C# records now round-trip to on-chain CBOR effortlessly!


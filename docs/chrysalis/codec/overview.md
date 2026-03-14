---
title: Overview
sidebar_position: 1
---

# Chrysalis.Codec

Chrysalis.Codec is a high-performance CBOR serialization library for Cardano. A Roslyn incremental source generator emits serializers at compile time — no reflection, no runtime overhead, no manual encoding.

## How It Works

1. **Annotate** your record with `[CborSerializable]` and a structure attribute (`[CborList]`, `[CborMap]`, `[CborConstr]`, etc.)
2. **Mark it as `partial`** so the source generator can extend it
3. **Inherit from `CborRecord`** (or implement `ICborType` for structs)
4. The generator emits `Read()`, `Write()`, and `Create()` methods at compile time

```csharp
using Chrysalis.Codec.Serialization.Attributes;
using Chrysalis.Codec.Types;

[CborSerializable]
[CborList]
public partial record TransactionInput(
    [CborOrder(0)] ReadOnlyMemory<byte> TransactionId,
    [CborOrder(1)] uint Index
) : CborRecord;
```

This generates:
- `TransactionInput.Read(data)` — deserialize from CBOR bytes
- `TransactionInput.Write(output, value)` — serialize to a buffer
- `TransactionInput.Create(txId, index)` — construct from values and produce valid CBOR
- `CborSerializer.Serialize(value)` / `CborSerializer.Deserialize<T>(data)` — convenience wrappers

## Key Features

- **Zero reflection** — all serialization logic is baked into the assembly at compile time
- **Zero-copy deserialization** — `ReadOnlyMemory<byte>` throughout, lazy field access, raw bytes preserved for round-trips
- **Full Cardano CDDL coverage** — transactions, blocks, protocol parameters, scripts, governance
- **Blueprint codegen** — auto-generate types from Aiken's `plutus.json` with [CIP-0057 Blueprint Codegen](./blueprint-codegen)
- **`Create()` factories** — source-generated on every type, serialize values to valid CBOR without manual encoding
- **`[PlutusData(N)]` shorthand** — single attribute for Plutus datum/redeemer types (combines `[CborSerializable]` + `[CborConstr(N)]`)

## Under the Hood

The source generator (`Chrysalis.Codec.CodeGen`) runs as a Roslyn incremental generator. It:

1. Scans for types with `[CborSerializable]` via a syntax provider
2. Extracts metadata: field types, order, tags, encoding flags
3. Routes to a type-specific emitter (Constructor, List, Map, Union, Container)
4. Emits optimized `Read`/`Write`/`Create` methods as `partial` class extensions

For blueprint types, the same generator also reads `plutus.json` files from `AdditionalTexts`, resolves the CIP-0057 schema, and emits both the type definitions and their serializers in a single pass.

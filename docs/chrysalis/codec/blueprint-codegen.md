---
title: Blueprint Codegen
sidebar_position: 3
---

# CIP-0057 Blueprint Codegen

Cardano smart contract compilers like [Aiken](https://aiken-lang.org/) produce a `plutus.json` blueprint file containing validator definitions, compiled UPLC code, and a full type schema. Chrysalis reads this file at compile time and auto-generates fully typed, serializable C# types — no manual type definitions needed.

## Setup

Add the blueprint to your `.csproj`:

```xml
<ItemGroup>
  <PackageReference Include="Chrysalis.Codec" Version="*-*" />
  <PackageReference Include="Chrysalis.Codec.CodeGen" Version="*-*"
                    OutputItemType="Analyzer" ReferenceOutputAssembly="false" />
  <AdditionalFiles Include="plutus.json" />
</ItemGroup>
```

Build your project. Types appear in IntelliSense immediately.

## Usage

```csharp
using MyProject.Blueprint;  // namespace derived from blueprint preamble title

// Construct values with Create()
var credential = VerificationKeyCredential.Create(PlutusBoundedBytes.Create(keyHash));
var address = Address.Create(credential, None<ICredential>.Create());
var datum = SimpleDatum.Create(address, PlutusInt.Create(1_000_000),
    PlutusBoundedBytes.Create(tag), PlutusTrue.Create());

// Serialize — byte-identical to Aiken's cbor.serialise
byte[] cbor = CborSerializer.Serialize(datum);

// Deserialize back into the generated type
SimpleDatum decoded = CborSerializer.Deserialize<SimpleDatum>(cbor);
```

## What Gets Generated

The generator reads CIP-0057 schemas and produces:

| Blueprint Pattern | Generated C# |
|---|---|
| Single constructor (`index: 0`, fields) | `[CborConstr(0)] public partial record MyType(...) : CborRecord` |
| Multiple constructors (`anyOf`) | `[CborUnion] public partial interface IMyType` + variant records |
| Tuple (`dataType: "list"`, typed items) | `[CborList] public partial record MyTuple(...) : CborRecord` |
| Option (Some/None pattern) | `ICborOption<T>` |
| List (`dataType: "list"`, single items) | `CborDefList<T>` |
| Bytes / Integer / Bool / Data | Reuses `PlutusBoundedBytes`, `IPlutusBigInt`, `IPlutusBool`, `IPlutusData` |

Each generated type gets full `Read()`, `Write()`, and `Create()` methods.

## Validator Constants

For each validator in the blueprint, a static class is generated with the compiled code and script hash:

```csharp
// Auto-generated
public static class WizardScriptSpend
{
    public const string CompiledCode = "590231...";
    public const string Hash = "23e192...";
    public const string PlutusVersion = "v3";
}
```

## Namespace

The C# namespace is derived from the Aiken project's preamble title. For example:

| Aiken project title | C# namespace |
|---|---|
| `wizard-protocol/p2p` | `WizardProtocol.P2p.Blueprint` |
| `sundae/contracts` | `Sundae.Contracts.Blueprint` |
| `crashr-io/marketplace` | `CrashrIo.Marketplace.Blueprint` |

## How It Works

The blueprint generator is part of `Chrysalis.Codec.CodeGen` — the same Roslyn source generator that handles CBOR serialization. This means generated blueprint types get full serializer support in a single compilation pass (no cross-generator visibility issues).

The pipeline:
1. Read `plutus.json` from `AdditionalTexts`
2. Parse CIP-0057 schema, resolve `$ref` pointers, detect cycles
3. Classify types (constructor, union, tuple, primitive, option, list)
4. Resolve name collisions across definitions
5. Emit C# type definitions with CBOR attributes
6. Convert resolved types to serializer metadata
7. Emit Read/Write/Create methods via the existing CBOR emitter

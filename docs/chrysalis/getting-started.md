---
title: Getting Started
sidebar_position: 2
slug: getting-started
---

# Getting Started

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) or later

## Install

```bash
dotnet add package Chrysalis --prerelease
```

This installs the umbrella package with everything included. For fine-grained control, see [individual packages](#individual-packages).

## Generate Types from Aiken Blueprints

If you're building with [Aiken](https://aiken-lang.org/), drop your compiled `plutus.json` into the project and get fully typed C# types at compile time:

```xml
<!-- .csproj -->
<ItemGroup>
  <AdditionalFiles Include="plutus.json" />
</ItemGroup>
```

```csharp
using MyProject.Blueprint;

// Types are auto-generated — construct with Create()
var datum = SimpleDatum.Create(
    Address.Create(
        VerificationKeyCredential.Create(PlutusBoundedBytes.Create(keyHash)),
        None<ICredential>.Create()),
    PlutusInt.Create(1_000_000),
    PlutusBoundedBytes.Create(tag),
    PlutusTrue.Create());

// Serialize — byte-identical to Aiken's cbor.serialise
byte[] cbor = CborSerializer.Serialize(datum);
```

## Build Transactions

```csharp
using Chrysalis.Tx.Builders;

TransactionBuilder builder = TransactionBuilder.Create(pparams);

builder.AddInput("a1b2c3d4...#0");

builder.AddOutput("addr_test1qz...", Lovelace.Create(5_000_000))
    .WithInlineDatum(myDatum)
    .WithMinAda(pparams.AdaPerUTxOByte)
    .Add();

// Minting
builder.AddMint(policyHex, assetNameHex, 1_000);

// Sign
ITransaction signed = tx.Sign(paymentKey, stakeKey);
```

## Generate a Wallet

```csharp
using Chrysalis.Wallet.Models.Keys;
using Chrysalis.Wallet.Models.Addresses;

Mnemonic mnemonic = Mnemonic.Generate(24);

PrivateKey accountKey = mnemonic.GetRootKey().DeriveCardanoAccountKey();
PrivateKey paymentKey = accountKey.DerivePaymentKey();

Address address = Address.FromPublicKeys(
    NetworkType.Testnet, AddressType.BasePayment,
    paymentKey.GetPublicKey(),
    accountKey.DeriveStakeKey().GetPublicKey());

Console.WriteLine(address.ToBech32());
// addr_test1qz...
```

## Connect to a Node

```csharp
using Chrysalis.Network.Multiplexer;

// Local node via Unix socket
NodeClient node = await NodeClient.ConnectAsync("/ipc/node.socket");
await node.StartAsync(networkMagic);

var tip = await node.LocalStateQuery.GetTipAsync();
var utxos = await node.LocalStateQuery.GetUtxosByAddressAsync([addressBytes]);
```

## Evaluate Scripts

```csharp
using Chrysalis.Tx.Extensions;

// Pure C# Plutus VM — no Haskell or Rust dependencies
IReadOnlyList<EvaluationResult> results = ScriptContextBuilder.EvaluateTx(
    body, witnessSet, utxos, SlotNetworkConfig.Preview);
```

## Individual Packages

For projects that only need specific functionality:

```bash
dotnet add package Chrysalis.Codec   --prerelease   # CBOR serialization + source generation
dotnet add package Chrysalis.Network --prerelease   # Ouroboros mini-protocols (N2C/N2N)
dotnet add package Chrysalis.Tx      --prerelease   # Transaction building + fee calculation
dotnet add package Chrysalis.Wallet  --prerelease   # Key management + address handling
dotnet add package Chrysalis.Plutus  --prerelease   # Pure managed UPLC/CEK machine
```

When using individual packages, add the source generator as an analyzer:

```xml
<ItemGroup>
  <PackageReference Include="Chrysalis.Codec" Version="*-*" />
  <PackageReference Include="Chrysalis.Codec.CodeGen" Version="*-*"
                    OutputItemType="Analyzer" ReferenceOutputAssembly="false" />
</ItemGroup>
```

## Next Steps

- [Blueprint Codegen](./codec/blueprint-codegen) — auto-generate C# types from Aiken blueprints
- [Codec Overview](./codec/overview) — how source-generated CBOR serialization works
- [Transaction Building](./transactions/low-level-builder) — fluent API for building transactions
- [Wallet](./wallet/overview) — key derivation and address generation
- [Plutus VM](./plutus/overview) — pure C# UPLC interpreter

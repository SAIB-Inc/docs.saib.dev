---
title: Low-Level-Builder
sidebar_position: 1
---


# Low-Level Transaction Builder

The low-level `TransactionBuilder` in Chrysalis.Tx offers comprehensive control over Cardano transaction assembly, from UTxO inputs to output construction, minting, script data, and witness management. It follows a fluent API design:

- **Method Chaining:** Each call returns the builder instance.
- **Separation of Concerns:** Configure the transaction body, then witnesses, then build & sign.
- **Extension Support:** Built-in helpers for fee calculation and Plutus evaluation.

> **Note:** This API leverages core CBOR types from Chrysalis.Cbor (e.g., `CborAddress`, `Lovelace`, `CborEncodedValue`) to model on-chain data structures, ensuring type safety and consistency.

**Source**: [TransactionBuilder.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Tx/Builders/TransactionBuilder.cs)

---

## 1. Initialization

Begin by creating a builder instance with on-chain protocol parameters:

```csharp
// protocolParams from your Cardano provider (fees, execution unit prices)
var txBuilder = TransactionBuilder.Create(protocolParams);
```

> **Tip:** Immediately call `.SetNetworkId(...)` if you need to target testnet (`0`) or mainnet (`1`).

---

## 2. Configure Transaction Body

Use the following methods to assemble the core transaction payload.

### 2.1 Network & TTL

- **SetNetworkId(int networkId)**
  ```csharp
  txBuilder.SetNetworkId(1);
  ```
  Set network identifier (0=testnet, 1=mainnet).

- **SetTtl(ulong slot)**
  ```csharp
  txBuilder.SetTtl(currentSlot + 3600);
  ```
  Invalidate after this slot.

- **SetValidityIntervalStart(ulong slot)**
  ```csharp
  txBuilder.SetValidityIntervalStart(currentSlot);
  ```
  Specify earliest valid slot.

### 2.2 Inputs & Reference Inputs

- **AddInput(TransactionInput input)**
  ```csharp
  txBuilder.AddInput(utxo.Outref);
  ```
  Add a UTxO to fund outputs and fees.

- **SetInputs(List\<TransactionInput\> inputs)**
  ```csharp
  txBuilder.SetInputs(utxos.Select(u => u.Outref).ToList());
  ```
  Replace all inputs at once.

- **AddReferenceInput(TransactionInput input)**
  ```csharp
  txBuilder.AddReferenceInput(referenceOutref);
  ```
  Include reference UTxO for CIP-31 read-only script data.

- **SetReferenceInputs(List\<TransactionInput\> inputs)**
  Replace all reference inputs.

### 2.3 Outputs & Change

- **AddOutput(TransactionOutput output, bool isChange = false)**
  ```csharp
  txBuilder.AddOutput(output, isChange: true);
  ```
  Mark output as change if you want automatic fee-adjustment.

- **SetOutputs(List\<TransactionOutput\> outputs)**
  Override all outputs.

### 2.4 Fees & Collateral

- **SetFee(ulong feeLov)**
  ```csharp
  txBuilder.SetFee(150000UL);
  ```
  Manually set transaction fee.

- **AddCollateral(TransactionInput collateral)**
  ```csharp
  txBuilder.AddCollateral(collateralOutref);
  ```
  Provide UTxOs to cover script failures on Plutus.

- **SetCollateralReturn(TransactionOutput changeOut)**
  ```csharp
  txBuilder.SetCollateralReturn(changeOutput);
  ```
  Designate where unused collateral returns.

- **SetTotalCollateral(ulong lovelace)**
  ```csharp
  txBuilder.SetTotalCollateral(10000000UL);
  ```
  Define a fixed collateral amount for script failure scenarios.

### 2.5 Certificates & Withdrawals & Withdrawals

- **AddCertificate(Certificate cert)**
  ```csharp
  txBuilder.AddCertificate(cert);
  ```
  Append stake pool or governance certificates.

- **SetWithdrawals(Withdrawals wdrls)**
  ```csharp
  txBuilder.SetWithdrawals(withdrawals);
  ```
  Include stake withdrawal directives.

### 2.6 Minting & Metadata

- **AddMint(MultiAssetMint mintBundle)**
  ```csharp
  txBuilder.AddMint(mintBundle);
  ```
  Merge new token minting policies and quantities.

- **SetMint(MultiAssetMint mintBundle)**
  ```csharp
  txBuilder.SetMint(mintBundle);
  ```
  Replace the mint section entirely.

- **SetAuxiliaryDataHash(byte[] hash)**
  ```csharp
  txBuilder.SetAuxiliaryDataHash(metadataHash);
  ```
  Attach metadata hash only (not full data).

- **SetAuxiliaryData(AuxiliaryData data)**
  ```csharp
  txBuilder.SetAuxiliaryData(auxData);
  ```
  Embed full metadata map.

### 2.7 Script Data & Governance

- **SetScriptDataHash(byte[] hash)**
  ```csharp
  txBuilder.SetScriptDataHash(scriptDataHash);
  ```
  Reference Plutus script data hash for CIP-33 reference scripts.

- **SetVotingProcedures(VotingProcedures procedures)**
  ```csharp
  txBuilder.SetVotingProcedures(votingProcedures);
  ```
  Configure Conway-era governance voting rules.

- **AddProposalProcedure(ProposalProcedure proc)**
  ```csharp
  txBuilder.AddProposalProcedure(proposalProcedure);
  ```
  Append CIP procedures.

- **SetTreasuryValue(ulong amount)**
  ```csharp
  txBuilder.SetTreasuryValue(treasuryAmount);
  ```
  Allocate treasury withdrawals.

- **SetDonation(ulong amount)**
  ```csharp
  txBuilder.SetDonation(donationAmount);
  ```
  Allocate community fund donations.

---

## 3. Configure Witness Set

After building the body, collect witnesses:

```csharp
// Example: add vkey witness and Plutus scripts
txBuilder
  .AddVKeyWitness(new VKeyWitness(pubKey, sig))
  .AddNativeScript(new ScriptPubKey(0, keyHash))
  .AddPlutusV1Script(plutusV1Bytes)
  .AddPlutusData(myDatum)
  .SetRedeemers(new RedeemerMap(myRedeemers));
```

- **AddVKeyWitness(VKeyWitness)** – signature by a payment key.
- **AddNativeScript(NativeScript)** – multi-sig & time-locks.
- **AddBootstrapWitness(BootstrapWitness)** – Byron-era cont.
- **AddPlutusV1/V2/V3Script(byte[] script)** – raw script bytes.
- **AddPlutusData(PlutusData datum)** – attach datums.
- **SetRedeemers(Redeemers map)** – set all redeemer entries.

---

## 4. Build, Extend, & Sign

### Fee Calculation & Script Evaluation

Use extensions for common workflows:

```csharp
// 1. Estimate fee including Plutus execution
txBuilder.CalculateFee(plutusScript, mockWitnessFee: 2);

// 2. Run off-chain script evaluation to refine ExUnits
txBuilder.Evaluate(resolvedUtxos);
```

### Build & Sign

```csharp
var unsignedTx = txBuilder.Build();          // returns PostMaryTransaction
var signedTx   = unsignedTx.Sign(privateKey); // final Transaction
```

- `.Build()` produces a `Transaction` with body, witnesses, `IsValid=true`, optional aux data.
- `.Sign()` signs the built transaction, yielding a ready-to-submit `Transaction`.

---

## 5. Full Low-Level Example

```csharp
// Setup
var txBuilder = TransactionBuilder.Create(protocolParams)
    .SetNetworkId(1)
    .SetTtl(slotTip + 7200)
    .SetValidityIntervalStart(slotTip)
    .SetInputs(utxos.Select(u => u.Outref).ToList())
    .AddOutput(
        new PostAlonzoTransactionOutput(
            new CborAddress(recipientBytes),
            new Lovelace(5_000_000UL),
            null,
            null
        )
    , isChange: true)
    .AddCollateral(collateralOutref)
    .SetAuxiliaryDataHash(metadataHash);

// Add witnesses
txBuilder.AddVKeyWitness(vkeyWit);

// Extensions
txBuilder.CalculateFee(plutusScript);
txBuilder.Evaluate(resolvedUtxos);

// Build & sign
var tx = txBuilder.Build();
var signed = tx.Sign(privateKey);

// Signed Tx can now be submitted to the network

```
This example demonstrates a complete low-level workflow, leveraging fluent builder calls, extension methods for fees and scripts, and final submission.


---
title: Builtins
sidebar_position: 3
---

# Builtins

A reference for all built‑in types provided by the Chrysalis.Cbor library. These helper types cover CBOR patterns—from base classes and raw payload wrappers to collections, union types, and domain‑specific constructs.

---

## Core Base Types

| Type               | Description                                                                | Source                                                                                                        |
|--------------------|----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `CborBase`         | Root class for all serializable records, includes optional Raw bytes and constructor index. | [CborBase.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborBase.cs)             |
| `CborEncodedValue` | Record wrapping raw CBOR byte payloads for embedding without interpretation. | [CborEncodedValue.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborEncodedValue.cs) |

---

## Collection

| Type                    | Description                                                                  | Source                                                                                                                           |
|-------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `CborMaybeIndefList<T>` | Union for lists encoded with definite or indefinite length.                  | [CborMaybeIndefList.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborMaybeIndefList.cs)  |
| `CborDefList<T>`        | Definite-length CBOR list variant.                                           | [CborMaybeIndefList.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborMaybeIndefList.cs)  |
| `CborIndefList<T>`      | Indefinite-length CBOR list variant.                                         | [CborMaybeIndefList.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborMaybeIndefList.cs)  |
| `CborDefListWithTag<T>` | Definite-length list with CBOR tag 258.                                       | [CborMaybeIndefList.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborMaybeIndefList.cs)  |
| `CborIndefListWithTag<T>`| Indefinite-length list with CBOR tag 258.                                     | [CborMaybeIndefList.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborMaybeIndefList.cs)  |

---

## Optional

| Type       | Description                                 | Source                                                         |
|------------|---------------------------------------------|----------------------------------------------------------------|
| `Option<T>`| Union type for optional values.             | [Option.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Option.cs) |
| `Some<T>`  | Represents present value (constructor 0).    | [Option.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Option.cs) |
| `None<T>`  | Represents absence of value (constructor 1). | [Option.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Option.cs) |

---

## Fixed‑Value Records

| Type      | Description                              | Source                                                          |
|-----------|------------------------------------------|-----------------------------------------------------------------|
| `Value0`  | Record enforcing integer value 0.        | [ExactValue.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/ExactValue.cs) |
| …         | …                                        | …                                                               |
| `Value12` | Record enforcing integer value 12.       | [ExactValue.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/ExactValue.cs) |

---

## Rational Number

| Type                  | Description                                  | Source                                                                                           |
|-----------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------|
| `CborRationalNumber`  | Tag 30 array of `[Numerator, Denominator]`.   | [CborRationalNumber.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/CborRationalNumber.cs) |

---

## Core Types

| Type             | Description                                                       | Source                                                                                                    |
|------------------|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `AuxiliaryData`  | Map of transaction metadata entries.                              | [AuxiliaryData.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/AuxiliaryData.cs) |
| `Block`          | Encoded blockchain block with header, raw body and metadata.      | [Block.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Block.cs)  |
| `BlockWithEra`   | Block prefixed with era tag.                                      | [BlockWithEra.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/BlockWithEra.cs) |

---

## Transaction Types

| Type                     | Description                                          | Source                                                                                                                                |
|--------------------------|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `Transaction`            | Union of all transaction versions.                   | [Transaction.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/Transaction.cs)    |
| `ShelleyTransaction`     | Shelley-era transaction struct.                      | [Transaction.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/Transaction.cs)    |
| `AllegraTransaction`     | Allegra-era transaction struct.                      | [Transaction.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/Transaction.cs)    |
| `PostMaryTransaction`    | Mary+ era transaction struct with validity flag.     | [Transaction.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/Transaction.cs)    |
| `TransactionBody`        | Union of all transaction body versions.              | [TransactionBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionBody.cs) |
| `AlonzoTransactionBody`  | Alonzo-era body map.                                 | [TransactionBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionBody.cs) |
| `BabbageTransactionBody` | Babbage-era body map with collateral fields.         | [TransactionBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionBody.cs) |
| `ConwayTransactionBody`  | Conway-era body map with governance fields.          | [TransactionBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionBody.cs) |
| `TransactionInput`       | UTxO reference input struct.                         | [TransactionInput.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionInput.cs) |
| `TransactionOutput`      | Union of all transaction output versions.             | [TransactionOutput.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionOutput.cs) |
| `AlonzoTransactionOutput`| Alonzo-era output tuple.                             | [TransactionOutput.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionOutput.cs) |
| `PostAlonzoTransactionOutput` | Post-Alonzo output map | [TransactionOutput.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Transaction/TransactionOutput.cs) |

---

## Witness Types

| Type | Description | Source |
|------|-------------|--------|
| `VKeyWitness` | Verification key witness | [VKeyWitness.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/VKeyWitness.cs) |
| `BootstrapWitness` | Legacy bootstrap witness | [BootstrapWitness.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/BootstrapWitness.cs) |
| `TransactionWitnessSet` | Union of all witness set types | [TransactionWitnessSet.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/TransactionWitnessSet.cs) |
| `AlonzoTransactionWitnessSet` | Alonzo-era witness set map | [TransactionWitnessSet.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/TransactionWitnessSet.cs) |
| `PostAlonzoTransactionWitnessSet` | Post-Alonzo witness set map | [TransactionWitnessSet.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/TransactionWitnessSet.cs) |
| `RedeemerMap` | Map of redeemer entries for Plutus scripts | [Redeemers.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/Redeemers.cs) |
| `RedeemerEntry` | Single redeemer entry | [Redeemers.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/Redeemers.cs) |
| `RedeemerKey` | Redeemer context key | [Redeemers.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/Redeemers.cs) |
| `RedeemerValue` | Redeemer payload with execution units | [Redeemers.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/Redeemers.cs) |

---

## Script Types

| Type | Description | Source |
|------|-------------|--------|
| `NativeScript` | Union of native script types | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `ScriptPubKey` | Script public key construct | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `ScriptAll` | Requires all sub-scripts to pass | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `ScriptAny` | Requires any one sub-script to pass | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `ScriptNOfK` | Requires N of K sub-scripts to pass | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `InvalidBefore` | Time lock: valid only after slot | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `InvalidHereafter` | Time lock: valid only before slot | [NativeScript.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/NativeScript.cs) |
| `Script` | Union of multi-sig and Plutus scripts | [Script.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/Script.cs) |
| `MultiSigScript` | Multi-signature script | [Script.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/Script.cs) |
| `PlutusV1Script` | Plutus V1 script container | [Script.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/Script.cs) |
| `PlutusV2Script` | Plutus V2 script container | [Script.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/Script.cs) |
| `PlutusV3Script` | Plutus V3 script container | [Script.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/Script.cs) |

---

## Protocol Types

| Type | Description | Source |
|------|-------------|--------|
| `CostMdls` | Cost models per script language | [CostMdls.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/CostMdls.cs) |
| `ExUnitPrices` | Memory and step prices | [ExUnitPrices.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/ExUnitPrices.cs) |
| `ExUnits` | Execution units (memory and steps) | [ExUnits.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/ExUnits.cs) |
| `Nonce` | Union of nonce types for entropy | [Nonce.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/Nonce.cs) |
| `NonceWithHash` | Nonce with hash value | [Nonce.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/Nonce.cs) |
| `NonceWithoutHash` | Nonce without hash | [Nonce.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/Nonce.cs) |
| `PoolVotingThresholds` | Governance voting thresholds | [PoolVotingThresholds.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/PoolVotingThresholds.cs) |
| `ProtocolParamUpdate` | Union of protocol parameter updates per era | [ProtocolParamUpdate.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/ProtocolParamUpdate.cs) |
| `ProposedProtocolParameterUpdates` | Map of proposed protocol updates | [ProtocolParamUpdate.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Protocol/ProtocolParamUpdate.cs) |

---

## Header Types

| Type                  | Description                                                       | Source                                                                                                                   |
|-----------------------|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `BlockHeader`         | Encoded block header                                              | [BlockHeader.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/BlockHeader.cs) |
| `BlockHeaderBody`     | Union of header body formats                                      | [HeaderBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/HeaderBody.cs)   |
| `AlonzoHeaderBody`    | Alonzo-era header body                                            | [HeaderBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/HeaderBody.cs)   |
| `BabbageHeaderBody`   | Babbage-era header body                                           | [HeaderBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/HeaderBody.cs)   |
| `ConwayHeaderBody`    | Conway-era header body                                            | [HeaderBody.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/HeaderBody.cs)   |
| `OperationalCert`     | Node operational certificate                                      | [OperationalCert.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/OperationalCert.cs) |
| `ProtocolVersion`     | Protocol version indicator                                        | [ProtocolVersion.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Header/ProtocolVersion.cs) |

---

## Governance Types

| Type                  | Description                                                       | Source                                                                                                                         |
|-----------------------|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `VotingProcedures`    | Governance voting rules                                          | [VotingProcedures.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Governance/VotingProcedures.cs) |
| `ProposalProcedures`  | CIP procedure definitions                                        | [ProposalProcedures.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Governance/ProposalProcedures.cs) |
| `TreasuryValue`       | Community treasury balance                                       | [TreasuryValue.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Governance/TreasuryValue.cs)   |
| `Donation`            | Donation entry to treasury fund                                  | [Donation.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Governance/Donation.cs)         |

---

## Common Types

| Type           | Description                         | Source                                                                                                                      |
|----------------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `Lovelace`     | Base ADA unit wrapper               | [Lovelace.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Common/Lovelace.cs)         |
| `AssetName`    | Token name wrapper                  | [AssetName.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Common/AssetName.cs)       |
| `PolicyId`     | Asset policy identifier             | [PolicyId.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Common/PolicyId.cs)         |
| `MultiAsset`   | Map of PolicyId to AssetName and quantity | [MultiAsset.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Common/MultiAsset.cs)        |
| `Value`        | Union of Lovelace or MultiAsset     | [Value.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Common/Value.cs)              |

---

## Certificate Types

| Type                 | Description                               | Source                                                                                                                                |
|----------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `StakeCredential`    | Stake credential for delegation/rewards   | [StakeCredential.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/StakeCredential.cs) |
| `RewardAccount`      | Reward account address                    | [RewardAccount.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/RewardAccount.cs)   |
| `StakeRegistration`  | Stake registration certificate            | [StakeRegistration.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/StakeRegistration.cs) |
| `StakeDeregistration`| Stake deregistration certificate          | [StakeDeregistration.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/StakeDeregistration.cs) |
| `Delegation`         | Stake delegation certificate              | [Delegation.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/Delegation.cs)       |
| `PoolKeyHash`        | Pool identifier for delegation            | [PoolKeyHash.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/PoolKeyHash.cs)       |
| `PoolParams`         | Pool registration parameters              | [PoolParams.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Certificates/PoolParams.cs)         |

---

## Plutus Types

| Type           | Description                             | Source                                                                                                                    |
|----------------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `Data`         | Union for Constr, Map, List, Integer, Bytes | [Data.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Plutus/Data.cs)                           |
| `Redeemer`     | Redeemer payload for script execution   | [Redeemers.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/TransactionWitness/Redeemers.cs) |
| `PlutusScript` | Versioned Plutus script container       | [Script.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Cardano/Core/Scripts/Script.cs)        |

---

## Plutus Address Types

| Type              | Description                            | Source                                                                                                                      |
|-------------------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `EnterpriseAddress`| Address without stake component        | [EnterpriseAddress.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Plutus/Address/EnterpriseAddress.cs) |
| `BaseAddress`     | Address with payment & staking creds   | [BaseAddress.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Plutus/Address/BaseAddress.cs)          |
| `PointerAddress`  | Address with pointer to certificate    | [PointerAddress.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Plutus/Address/PointerAddress.cs)    |
| `Pointer`         | Certificate pointer (slot, tx, cert)   | [Pointer.cs](https://github.com/SAIB-Inc/Chrysalis/blob/main/src/Chrysalis.Cbor/Types/Plutus/Address/Pointer.cs)                |

---
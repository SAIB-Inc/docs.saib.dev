---
sidebar_position: 2
title: Core Concepts
---

# Core Concepts

This guide explores the technical concepts and implementation details for working with Cardano metadata in the Cardano.Metadata library.

---

## Metadata Structure

Cardano metadata is structured as a map where:
- Keys are integers (0-65535)
- Values can be integers, strings, byte arrays, lists, or nested maps
- Maximum transaction metadata size is 16KB

---

## Metadata Standards Implementation

### CIP-25: NFT Metadata Standard

Key structure for NFT metadata:
```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "My NFT",
        "image": "ipfs://...",
        "description": "A unique digital asset",
        "mediaType": "image/png"
      }
    }
  }
}
```

The `721` label identifies this as NFT metadata, allowing applications to parse and display NFTs correctly.

### CIP-68: Datum Metadata Standard

Key advantages over CIP-25:
- Metadata can be updated without burning tokens
- Supports larger metadata through datum storage
- Enables programmable NFTs with smart contract integration

Structure involves two tokens:
1. **Reference Token**: Contains metadata in its datum
2. **User Token**: The actual NFT held by users

### CIP-20: Transaction Message Standard

For attaching messages to transactions:
```json
{
  "674": {
    "msg": ["This is a transaction message"]
  }
}
```

---

## Metadata Labels

Integer labels categorize different metadata types:

| Label | Purpose | Standard |
|-------|---------|----------|
| 721   | NFT Metadata | CIP-25 |
| 20    | Transaction Messages | CIP-20 |
| 674   | Transaction Messages (alt) | CIP-20 |
| 1967  | Arbitrary Data | - |

---

## Validation

The library enforces Cardano's metadata constraints:

### String Constraints
- Maximum 64 bytes when UTF-8 encoded
- Must split longer strings into arrays

### Structure Constraints
- Maximum nesting depth: 1000 levels
- Map keys must be unique
- Arrays can contain mixed types

### Size Constraints
- Total metadata: 16KB per transaction
- Individual strings: 64 bytes
- No limit on number of metadata entries

---

## Evolution

The Cardano ecosystem continues to develop new standards:
- **CIP-27**: Royalty metadata
- **CIP-60**: Music NFT metadata
- **CIP-102**: Standardized datum structures

The Cardano.Metadata library is designed to adapt to these evolving standards while maintaining backward compatibility.
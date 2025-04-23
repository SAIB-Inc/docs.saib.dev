---
title: Address
sidebar_position: 4
---

# Address Construction & Parsing

The `Address` class automates Cardano address encoding, decoding, and credential extraction.

## Creating an Address

```csharp
// From Bech32 string
var addr1 = new Address("addr_test1qp...");

// From raw bytes (hex string converted to byte[])
byte[] bytes = Convert.FromHexString("abcdef0123...");
var addr2 = new Address(bytes);
```

Both constructors detect network (mainnet/testnet), address type (payment, enterprise, base, pointer), and extract payment/stake credentials.

## Instance Methods

- `string ToBech32()` — Encodes to Bech32 with correct prefix.  
- `byte[] ToBytes()` — Returns raw address bytes.  
- `string ToHex()` — Lowercase hex representation.  
- `byte[] GetPaymentKeyHash()` — Extracts the payment credential hash.  
- `byte[]? GetStakeKeyHash()` — Extracts the staking credential hash (if present).

Use these APIs to seamlessly integrate address operations into your wallet or transaction logic.

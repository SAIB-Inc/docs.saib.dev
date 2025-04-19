---
title: Key Derivation
sidebar_position: 3
---

# HD Key Derivation (CIP-1852 / CIP-1853)

Chrysalis.Wallet implements Shelley HD wallets via CIP‑1852 and multi-account extensions in CIP‑1853.  

## Derivation Path Structure
```
m / 1852' / 1815' / account' / role / index
```
- **1852'**: Purpose (Shelley wallets)  
- **1815'**: Coin type for Ada  
- **account'**: Account index (hardened)  
- **role**: 0 = External (payment), 1 = Staking  
- **index**: Address index (soft)

## Example: Payment & Staking Keys
```csharp
// 1. Restore root key
var rootKey = mnemonic.GetRootKey();

// 2. Derive account key (m/1852'/1815'/0')
var account = rootKey
    .Derive(PurposeType.Shelley,    DerivationType.HARD)
    .Derive(CoinType.Ada,           DerivationType.HARD)
    .Derive(0,                      DerivationType.HARD);

// 3. Payment key (role=0, index=0)
var paymentKey = account
    .Derive(RoleType.ExternalChain, DerivationType.SOFT)
    .Derive(0,                      DerivationType.SOFT);

// 4. Staking key (role=1, index=0)
var stakingKey = account
    .Derive(RoleType.Staking,      DerivationType.SOFT)
    .Derive(0,                      DerivationType.SOFT);
```

You can also derive additional accounts or asset‑specific keys using CIP‑1853 extensions.
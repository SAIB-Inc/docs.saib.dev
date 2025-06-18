---
title: Cryptographic Keys
sidebar_position: 2
---

# Cryptographic Keys

Cardano stake pools use multiple types of cryptographic keys for security and functionality. Understanding these keys is crucial for safe pool operation.

## Key Types Overview

| Key Type | Purpose | Hot/Cold | Rotation | Exposure Risk |
|----------|---------|----------|----------|---------------|
| **Payment Keys** | Control pool rewards | Cold | Never | High - Loss of funds |
| **Stake Keys** | Pool ownership & pledge | Cold | Never | High - Loss of pool |
| **Cold Keys** | Pool identity & certificates | Cold | Never | High - Pool compromise |
| **VRF Keys** | Slot leader selection | Hot | Never | Medium - No blocks |
| **KES Keys** | Block signing | Hot | 90 days | Low - Temporary impact |
| **Operational Certificate** | Links cold to hot keys | Hot | 90 days | Low - With KES |

---

## Understanding Each Key Type

### Payment Keys (addr.skey/addr.vkey)

Payment keys control the wallet that receives pool rewards and pays for transactions.

**Purpose:**
- Receive pool operator rewards
- Pay for pool transactions (registration, updates)
- Control pledged funds

**Security:**
- Store offline (cold storage)
- Never put on pool servers
- Consider hardware wallet
- Backup multiple copies securely

:::danger Critical
Loss of payment keys means loss of all funds in that address. These are your most sensitive keys.
:::

### Stake Keys (stake.skey/stake.vkey)

Stake keys represent pool ownership and are used for:

**Purpose:**
- Registering stake address
- Delegating to your own pool (pledge)
- Claiming rewards
- Retiring the pool

**Security:**
- Store offline with payment keys
- Required only for certificates
- Never needed on running nodes

### Cold Keys (cold.skey/cold.vkey/cold.counter)

Cold keys are the pool's master identity keys.

**Purpose:**
- Generate pool certificate
- Create operational certificates
- Authorize KES key rotations
- Update pool parameters

**Components:**
```bash
cold.skey     # Secret key - NEVER expose
cold.vkey     # Verification key - Public
cold.counter  # Tracks operational certs issued
```

**Security:**
- Generate on air-gapped machine
- Store offline permanently
- Never copy to online systems
- The counter prevents replay attacks

:::info Air-Gapped Generation
Generate cold keys on a computer that has never and will never connect to the internet for maximum security.
:::

### VRF Keys (vrf.skey/vrf.vkey)

Verifiable Random Function keys prove your pool's right to create blocks.

**Purpose:**
- Participate in slot leader election
- Prove block creation rights
- Generate randomness for protocol

**Characteristics:**
- Required on block producer
- Never rotated
- Part of pool registration

**Security Impact:**
- Loss prevents block creation
- No direct fund risk
- Requires pool re-registration to replace

### KES Keys (kes.skey/kes.vkey)

Key Evolving Signature keys provide forward security for block signing.

**Purpose:**
- Sign blocks you produce
- Evolve automatically for security
- Limit damage from key compromise

**Rotation Schedule:**
- Valid for 129,600 slots (90 days)
- Must rotate before expiry
- Track current KES period

```bash
# Check current KES period
CURRENT_SLOT=$(cardano-cli query tip --mainnet | jq -r '.slot')
KES_PERIOD=$((CURRENT_SLOT / 129600))
echo "Current KES Period: $KES_PERIOD"
```

### Operational Certificate (node.cert)

Links your cold keys to hot KES keys, allowing block production without exposing cold keys.

**Contains:**
- KES verification key
- Issue counter
- KES period validity
- Cold key signature

**Generation:**
```bash
cardano-cli node issue-op-cert \
  --kes-verification-key-file kes.vkey \
  --cold-signing-key-file cold.skey \
  --operational-certificate-issue-counter cold.counter \
  --kes-period <start-kes-period> \
  --out-file node.cert
```

---

## Key Generation Best Practices

### 1. Air-Gapped Environment

Create a secure environment:
```bash
# Use a live Linux USB that never touches network
# Ubuntu or Debian recommended
# Disable all network interfaces
# Generate all keys offline
```

### 2. Generation Order

Follow this sequence:
1. **Payment/Stake keys** - For addresses
2. **Cold keys** - Pool identity  
3. **VRF keys** - For randomness
4. **KES keys** - For block signing
5. **Operational certificate** - Links cold to KES

### 3. Secure Random Generation

Ensure proper entropy:
```bash
# Check available entropy
cat /proc/sys/kernel/random/entropy_avail

# Should be > 256, ideally > 1000
# Move mouse, type randomly to increase
```

---

## Key Storage Strategy

### Hot Storage (On Servers)
Only these files on block producer:
```
kes.skey          # Rotated every 90 days
vrf.skey          # Static hot key
node.cert         # Operational certificate
```

### Cold Storage (Offline)
Never on servers:
```
payment.skey      # Wallet control
stake.skey        # Stake control
cold.skey         # Pool identity
cold.counter      # Certificate counter
```

### Backup Strategy

```
┌─────────────────┐
│   Master Copy   │ USB/Paper
│  (Air-gapped)   │ Safety deposit box
└─────────────────┘
         ↓
┌─────────────────┐
│  Backup Copy 1  │ Encrypted USB
│  (Encrypted)    │ Home safe
└─────────────────┘
         ↓
┌─────────────────┐
│  Backup Copy 2  │ Encrypted cloud
│  (Encrypted)    │ Different provider
└─────────────────┘
```

---

## KES Key Rotation Process

### When to Rotate

Monitor KES expiry:
```bash
# Calculate remaining days
SLOTS_PER_KES=129600
CURRENT_SLOT=$(cardano-cli query tip --mainnet | jq -r '.slot')
CURRENT_KES=$((CURRENT_SLOT / SLOTS_PER_KES))
# Compare with your certificate's KES period
```

### Rotation Steps

1. **Generate new KES keys** (on secure machine)
2. **Create new operational certificate** (needs cold.skey)
3. **Copy to block producer**
4. **Restart node with new keys**
5. **Verify successful rotation**

:::warning Rotation Timing
Start rotation process at least 7 days before expiry to allow for any issues.
:::

---

## Security Considerations

### Access Control

```bash
# Proper file permissions
chmod 400 *.skey          # Read-only for owner
chmod 644 *.vkey          # Public keys readable
chown pooluser:pooluser * # Correct ownership
```

### Key Compromise Response

**If hot keys compromised:**
1. Generate new KES keys immediately
2. Create new operational certificate
3. Restart node with new keys
4. Monitor for suspicious activity

**If cold keys compromised:**
1. Generate entirely new pool keys
2. Register as new pool
3. Migrate delegators to new pool
4. Retire compromised pool

### Common Security Mistakes

❌ **Storing cold keys on servers**
- Even "temporarily" is too risky
- Use USB transfer for certificates only

❌ **Not backing up keys**
- Single point of failure
- Lost keys = lost pool

❌ **Sharing keys for "help"**
- Never share private keys
- Scammers often request keys

❌ **Poor KES rotation planning**
- Missing rotation = no blocks
- Automate monitoring

---

## Verification Commands

### Verify Key Integrity
```bash
# Check key pair match
cardano-cli latest key verification-key \
  --signing-key-file stake.skey \
  --verification-key-file stake.vkey

# Verify operational certificate
cardano-cli latest text-view decode-cbor \
  --in-file node.cert
```

### Monitor KES Status
```bash
# On running node
cardano-cli latest query kes-period-info \
  --op-cert-file node.cert
```

## Next Steps

- Learn about [Network Topology](/docs/cardano/stake-pools/core-concepts/network-topology)
- Understand [Hardware Requirements](/docs/cardano/stake-pools/core-concepts/hardware-requirements)

---
---
title: Cryptographic Keys
sidebar_position: 2
---

# Cryptographic Keys

Running a Cardano stake pool requires managing several types of cryptographic keys. Each key has a specific purpose, and understanding how to generate, store, and use them correctly is critical for pool security.

## Overview of Pool Keys

A Cardano stake pool uses six different types of keys. Think of them like a set of specialized keys for different doors in a building - each opens something specific and some are more critical than others.

| Key Type                    | Purpose                    | Where It Lives  | Rotation Schedule |
|-----------------------------|----------------------------|-----------------|-------------------|
| **Payment keys**            | Control rewards wallet     | Cold (offline)  | Never             |
| **Stake keys**              | Own the pool registration  | Cold (offline)  | Never             |
| **Cold keys**               | Master pool identity       | Cold (offline)  | Never             |
| **VRF keys**                | Prove right to make blocks | Hot (on server) | Never             |
| **KES keys**                | Sign blocks (time-limited) | Hot (on server) | Every 93 days     |
| **Operational certificate** | Links cold and KES keys    | Hot (on server) | Every 93 days     |

## Understanding Each Key Type

### Payment Keys

Payment keys control the wallet where your pool rewards are sent. These are standard Cardano wallet keys, consisting of a signing key (secret) and verification key (public).

**Files created**:
```
payment.skey  # Secret signing key - NEVER share this
payment.vkey  # Public verification key
payment.addr  # Wallet address derived from keys
```

**What they control**:
- Pool rewards payments
- Pledge funds
- Transaction fees

**Security level**: CRITICAL - Loss means loss of all funds in that address

### Stake Keys

Stake keys represent ownership of your pool registration. They're used to register, update, and retire your pool.

**Files created**:
```
stake.skey    # Secret signing key for stake address
stake.vkey    # Public verification key
stake.addr    # Stake address for registration
```

**What they control**:
- Pool registration certificate
- Pool retirement
- Delegation certificates

**Security level**: CRITICAL - Loss means you can't manage your pool

### Cold Keys

Cold keys are your pool's master identity keys. They should be generated on an air-gapped machine and never touch an online system.

**Files created**:
```
cold.skey     # Secret key - your pool's identity
cold.vkey     # Public key - shared in certificates
cold.counter  # Counter tracking operational certificates issued
```

The counter file is crucial - it prevents replay attacks by tracking how many operational certificates you've created.

**What they control**:
- Operational certificate generation
- Pool parameter updates
- KES key rotation authorization

**Security level**: CRITICAL - Compromise means someone can impersonate your pool

### VRF Keys

VRF (Verifiable Random Function) keys prove your pool's right to create blocks when selected. These keys generate cryptographic proofs that the protocol can verify.

**Files created**:
```
vrf.skey      # Secret VRF key - needed on block producer
vrf.vkey      # Public VRF key - included in pool registration
```

**What they do**:
- Generate randomness for slot leader selection
- Prove your pool was legitimately selected
- Must be online for block production

**Security level**: MEDIUM - Loss means no block production until re-registration

### KES Keys

KES (Key Evolving Signature) keys sign the blocks your pool produces. They're unique because they automatically expire after 90 days as a security feature.

**Files created**:
```
kes.skey      # Secret signing key - evolves over time
kes.vkey      # Public verification key
```

**Why they expire**:
KES keys use forward-secure signatures. Even if compromised, old signatures can't be forged. The key evolves through 62 periods (129,600 slots each), totaling approximately 93.3 days.

**Security level**: LOW - Can be rotated without pool re-registration

### Operational Certificate

The operational certificate links your cold keys to your KES keys, allowing block production without exposing cold keys online.

**File created**:
```
node.cert     # Certificate signed by cold keys
```

**What it contains**:
- KES verification key
- Start KES period
- Issue counter
- Signature from cold keys

## Generating Keys Safely

The most critical aspect of key generation is doing it securely. Here's the recommended approach:

### 1. Prepare an Air-Gapped Environment

Use a computer that will never connect to the internet:

```bash
# Option 1: Live Linux USB (recommended)
# Download Ubuntu/Debian ISO, verify checksum, create bootable USB
# Boot from USB, never connect to network

# Option 2: Dedicated offline machine
# Fresh OS install, disable all network interfaces
# Physical removal of network cards is even better
```

### 2. Install cardano-cli

On your air-gapped machine:

```bash
# Copy cardano-cli binary via USB from online machine
# Verify the binary hash matches official release
chmod +x cardano-cli
./cardano-cli version
```

### 3. Generate Keys in Order

Always generate keys in this sequence:

```bash
# 1. Payment keys
cardano-cli latest address key-gen \
    --verification-key-file payment.vkey \
    --signing-key-file payment.skey

# 2. Stake keys  
cardano-cli latest stake-address key-gen \
    --verification-key-file stake.vkey \
    --signing-key-file stake.skey

# 3. Generate stake address
cardano-cli latest stake-address build \
    --stake-verification-key-file stake.vkey \
    --out-file stake.addr

# 4. Generate payment address
cardano-cli latest address build \
    --payment-verification-key-file payment.vkey \
    --stake-verification-key-file stake.vkey \
    --out-file payment.addr

# 5. Cold keys
cardano-cli latest node key-gen \
    --cold-verification-key-file cold.vkey \
    --cold-signing-key-file cold.skey \
    --operational-certificate-issue-counter-file cold.counter

# 6. VRF keys
cardano-cli latest node key-gen-VRF \
    --verification-key-file vrf.vkey \
    --signing-key-file vrf.skey

# 7. KES keys (on block producer or air-gapped)
cardano-cli latest node key-gen-KES \
    --verification-key-file kes.vkey \
    --signing-key-file kes.skey
```

### 4. Create Operational Certificate

Determine the current KES period and create certificate:

```bash
# Get current slot (you'll need this from an online node)
# For this example, assume slot 112233445

# Calculate KES period
SLOTS_PER_KES_PERIOD=129600
CURRENT_SLOT=112233445
KES_PERIOD=$((CURRENT_SLOT / SLOTS_PER_KES_PERIOD))
echo "Current KES period: $KES_PERIOD"

# Generate operational certificate
cardano-cli latest node issue-op-cert \
    --kes-verification-key-file kes.vkey \
    --cold-signing-key-file cold.skey \
    --operational-certificate-issue-counter cold.counter \
    --kes-period $KES_PERIOD \
    --out-file node.cert
```

## Key Storage Best Practices

How you store your keys is as important as how you generate them.

### Cold Storage (Offline)

Never put these on internet-connected devices:
- payment.skey
- stake.skey  
- cold.skey
- cold.counter

**Storage methods**:
```
Primary: Encrypted USB drive in secure location
Backup 1: Different encrypted USB in separate location
Backup 2: Paper printout in bank safety deposit box
```

**Encryption example**:
```bash
# Encrypt sensitive keys
tar -czf - *.skey cold.counter | \
    gpg --symmetric --cipher-algo AES256 > pool_cold_keys.tar.gz.gpg

# Decrypt when needed
gpg --decrypt pool_cold_keys.tar.gz.gpg | tar -xzf -
```

### Hot Storage (On Block Producer)

Only these files on your block producer:
```
kes.skey      # Current KES key
vrf.skey      # VRF key  
node.cert     # Operational certificate
```

**Set proper permissions**:
```bash
chmod 400 kes.skey vrf.skey node.cert
chown cardano:cardano kes.skey vrf.skey node.cert
```

## KES Key Rotation

KES keys must be rotated before they expire. Here's the complete process:

### 1. Monitor KES Key Expiry

```bash
# Check current KES period on running node
cardano-cli latest query kes-period-info \
    --op-cert-file node.cert

# Example output:
# ✓ Operational certificate's KES period is within the correct KES period interval
# ✓ The current KES period is: 426
# ✗ The operational certificate expires in 17 KES periods, or 93.5 days
```

### 2. Generate New KES Key

When approaching expiry (within 7 days):

```bash
# On air-gapped machine or secure environment
cardano-cli latest node key-gen-KES \
    --verification-key-file kes_new.vkey \
    --signing-key-file kes_new.skey
```

### 3. Create New Operational Certificate

```bash
# Get current slot from online node
CURRENT_SLOT=$(cardano-cli latest query tip | grep "slot" | cut -d':' -f2 | tr -d ' ,')
KES_PERIOD=$((CURRENT_SLOT / 129600))

# On air-gapped machine with cold.skey
cardano-cli latest node issue-op-cert \
    --kes-verification-key-file kes_new.vkey \
    --cold-signing-key-file cold.skey \
    --operational-certificate-issue-counter cold.counter \
    --kes-period $KES_PERIOD \
    --out-file node_new.cert
```

### 4. Deploy New Keys

```bash
# On block producer
# Stop the node
systemctl stop cardano-node

# Backup old keys
mv kes.skey kes_old.skey
mv node.cert node_old.cert

# Install new keys
mv kes_new.skey kes.skey
mv node_new.cert node.cert

# Set permissions
chmod 400 kes.skey node.cert
chown cardano:cardano kes.skey node.cert

# Restart node
systemctl start cardano-node

# Verify successful rotation
cardano-cli latest query kes-period-info \
    --op-cert-file node.cert

# Check logs for successful block production
journalctl -u cardano-node -n 100 | grep "Forged block"
```

## Security Checklist

### Generation Security
- [ ] Used air-gapped machine for cold key generation
- [ ] Verified cardano-cli binary integrity
- [ ] Generated keys in correct order
- [ ] Never exposed cold keys to internet

### Storage Security
- [ ] Cold keys encrypted and offline
- [ ] Multiple secure backups exist
- [ ] Hot keys have restricted permissions
- [ ] Regular backup verification

### Operational Security
- [ ] KES rotation calendar reminders set
- [ ] Monitoring alerts for KES expiry
- [ ] Documented rotation procedures
- [ ] Tested recovery procedures

### Common Mistakes to Avoid

**Never**:
- Generate cold keys on online machines
- Store unencrypted keys on cloud services
- Share private keys for "help"
- Forget to backup cold.counter file
- Run multiple block producers with same keys

**Always**:
- Test key recovery procedures
- Monitor KES expiry actively
- Keep detailed operation logs
- Maintain secure backup locations

## Troubleshooting

### "Invalid operational certificate" Error

Check these in order:
1. KES period in certificate matches current period
2. Cold counter file is in sync
3. All keys belong to same pool
4. Certificate was created with correct keys

### Cannot Start Block Producer

Verify:
```bash
# Check file permissions
ls -la kes.skey vrf.skey node.cert

# Verify certificate validity
cardano-cli latest query kes-period-info \
    --op-cert-file node.cert

# Check VRF key hash
cardano-cli latest node key-hash-VRF \
    --verification-key-file vrf.vkey

# Verify node.cert contents
cardano-cli latest text-view decode-cbor \
    --in-file node.cert
```

## Next Steps

- Review [Network Topology](/docs/cardano/stake-pools/core-concepts/network-topology) for secure network setup
- Study [Pool Architecture](/docs/cardano/stake-pools/core-concepts/pool-architecture) for overall system design

Remember: Your keys are your pool. Treat them with the security and respect they deserve.
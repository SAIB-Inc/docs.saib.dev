---
title: Block Producer Configuration
sidebar_position: 4
---

# Block Producer Configuration

A block producer node is the core component of your stake pool that creates new blocks on the Cardano blockchain. This guide covers the complete setup process from key generation to pool registration.

:::warning Security First
Block producer nodes handle sensitive cryptographic keys. They must:
- Never be directly exposed to the internet
- Only connect to your own relay nodes
- Run in a secure, access-controlled environment
- Have all keys backed up securely offline
:::

## Prerequisites

Before configuring a block producer:
1. Have at least one relay node fully synchronized
2. Secure a dedicated server meeting [Hardware Requirements](/docs/cardano/stake-pools/core-concepts/hardware-requirements)
3. Understand [Cryptographic Keys](/docs/cardano/stake-pools/core-concepts/cryptographic-keys) used in stake pools
4. Have approximately 500 ADA for pool registration deposit plus transaction fees

## Block Producer vs Relay Configuration

Block producers differ from relays in critical ways:

| Aspect | Block Producer | Relay Node |
|--------|----------------|------------|
| Network exposure | Isolated, firewall protected | Public facing |
| Connections | Only to your relays | Many external peers |
| Host address | 127.0.0.1 or specific IP | 0.0.0.0 (all interfaces) |
| Keys required | Multiple operational keys | None |
| Port | Any (often 6000 or 3001) | Must be accessible externally |

## Setting Up the Block Producer

### Directory Structure

Create a secure directory structure for your block producer:

```bash
mkdir -p /opt/cardano/block-producer/{config,keys,db,logs}
cd /opt/cardano/block-producer

# Set restrictive permissions on keys directory
chmod 700 keys
```

### Configuration Files

Download the same configuration files as relay nodes, but modify the topology to only connect to your relays:

```json
{
  "Producers": [
    {
      "addr": "YOUR_RELAY1_IP",
      "port": 6000,
      "valency": 1
    },
    {
      "addr": "YOUR_RELAY2_IP", 
      "port": 6000,
      "valency": 1
    }
  ]
}
```

For P2P topology, set `useLedgerAfterSlot` to -1 to prevent external connections:

```json
{
  "localRoots": [
    {
      "accessPoints": [
        {"address": "YOUR_RELAY1_IP", "port": 6000},
        {"address": "YOUR_RELAY2_IP", "port": 6000}
      ],
      "advertise": false,
      "valency": 2
    }
  ],
  "publicRoots": [],
  "useLedgerAfterSlot": -1
}
```

## Key Generation Process

Cardano stake pools require multiple types of keys. Generate them in a secure, air-gapped environment when possible.

### Payment and Stake Keys

First, create the wallet keys that will own and control your pool:

```bash
# Payment key pair
cardano-cli address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey

# Stake key pair  
cardano-cli stake-address key-gen \
  --verification-key-file stake.vkey \
  --signing-key-file stake.skey

# Generate payment address
cardano-cli address build \
  --payment-verification-key-file payment.vkey \
  --stake-verification-key-file stake.vkey \
  --out-file payment.addr \
  --mainnet

# Generate stake address
cardano-cli stake-address build \
  --stake-verification-key-file stake.vkey \
  --out-file stake.addr \
  --mainnet
```

### Cold Keys

Cold keys are your pool's permanent identity and must be kept offline:

```bash
# Generate cold keys and counter
cardano-cli node key-gen \
  --cold-verification-key-file cold.vkey \
  --cold-signing-key-file cold.skey \
  --operational-certificate-issue-counter-file cold.counter

# Generate VRF key pair
cardano-cli node key-gen-VRF \
  --verification-key-file vrf.vkey \
  --signing-key-file vrf.skey
```

### KES Keys and Operational Certificate

Key Evolving Signature (KES) keys must be rotated periodically. Generate them on your block producer:

```bash
# Generate KES keys
cardano-cli node key-gen-KES \
  --verification-key-file kes.vkey \
  --signing-key-file kes.skey

# Find current KES period
SLOTS_PER_KES_PERIOD=$(cat shelley-genesis.json | jq -r '.slotsPerKESPeriod')
SLOT_TIP=$(cardano-cli query tip --mainnet | jq -r '.slot')
KES_PERIOD=$((SLOT_TIP / SLOTS_PER_KES_PERIOD))

# Generate operational certificate (valid for 62 KES periods)
cardano-cli node issue-op-cert \
  --kes-verification-key-file kes.vkey \
  --cold-signing-key-file cold.skey \
  --operational-certificate-issue-counter-file cold.counter \
  --kes-period $KES_PERIOD \
  --out-file node.cert
```

:::caution KES Key Rotation
KES keys expire after 62 periods (approximately 90 days on mainnet). Set up monitoring and rotate them before expiry to avoid missing blocks.
:::

## Pool Registration Process

### Register Stake Address

Before creating a pool, register your stake address on-chain:

```bash
# Create registration certificate
cardano-cli stake-address registration-certificate \
  --stake-verification-key-file stake.vkey \
  --out-file stake-registration.cert

# Submit in a transaction
cardano-cli transaction build \
  --tx-in $(cardano-cli query utxo --address $(cat payment.addr) --mainnet | tail -n +3 | head -n 1 | awk '{print $1"#"$2}') \
  --tx-out $(cat payment.addr)+0 \
  --change-address $(cat payment.addr) \
  --certificate-file stake-registration.cert \
  --witness-override 2 \
  --out-file tx.raw \
  --mainnet

# Sign and submit
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --signing-key-file stake.skey \
  --out-file tx.signed \
  --mainnet

cardano-cli transaction submit \
  --tx-file tx.signed \
  --mainnet
```

### Create Pool Metadata

Pool metadata provides information visible to delegators:

```json
{
  "name": "Your Pool Name",
  "description": "Pool description (max 255 chars)",
  "ticker": "POOL",
  "homepage": "https://yourpool.com",
  "extended": "https://yourpool.com/extended-metadata.json"
}
```

Upload this file to a publicly accessible URL and generate its hash:

```bash
cardano-cli stake-pool metadata-hash \
  --pool-metadata-file pool-metadata.json
```

### Generate Pool Registration Certificate

Create the certificate with all pool parameters:

```bash
cardano-cli stake-pool registration-certificate \
  --cold-verification-key-file cold.vkey \
  --vrf-verification-key-file vrf.vkey \
  --pool-pledge 1000000000 \
  --pool-cost 340000000 \
  --pool-margin 0.03 \
  --pool-reward-account-verification-key-file stake.vkey \
  --pool-owner-stake-verification-key-file stake.vkey \
  --mainnet \
  --pool-relay-ipv4 YOUR_RELAY1_IP \
  --pool-relay-port 6000 \
  --pool-relay-ipv4 YOUR_RELAY2_IP \
  --pool-relay-port 6000 \
  --metadata-url https://yourpool.com/metadata.json \
  --metadata-hash HASH_FROM_ABOVE \
  --out-file pool-registration.cert
```

Parameters explained:
- **pledge**: Amount in lovelace you commit (1 ADA = 1,000,000 lovelace)
- **cost**: Fixed fee per epoch in lovelace (minimum 340 ADA)
- **margin**: Variable fee percentage (0.03 = 3%)
- **relay**: Public relay endpoints (can specify multiple)

### Submit Pool Registration

Create and submit the registration transaction:

```bash
# Build transaction
cardano-cli transaction build \
  --tx-in $(cardano-cli query utxo --address $(cat payment.addr) --mainnet | tail -n +3 | head -n 1 | awk '{print $1"#"$2}') \
  --tx-out $(cat payment.addr)+0 \
  --change-address $(cat payment.addr) \
  --certificate-file pool-registration.cert \
  --certificate-file delegation.cert \
  --witness-override 3 \
  --out-file tx.raw \
  --mainnet

# Sign with all required keys
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --signing-key-file stake.skey \
  --signing-key-file cold.skey \
  --out-file tx.signed \
  --mainnet

# Submit to blockchain
cardano-cli transaction submit \
  --tx-file tx.signed \
  --mainnet
```

## Starting the Block Producer

### Service Configuration

Create `/etc/systemd/system/cardano-bp.service`:

```ini
[Unit]
Description=Cardano Block Producer Node
After=network.target

[Service]
Type=simple
User=cardano
Group=cardano
WorkingDirectory=/opt/cardano/block-producer
ExecStart=/usr/local/bin/cardano-node run \
  --topology /opt/cardano/block-producer/config/topology.json \
  --database-path /opt/cardano/block-producer/db \
  --socket-path /opt/cardano/block-producer/node.socket \
  --host-addr 127.0.0.1 \
  --port 6000 \
  --config /opt/cardano/block-producer/config/config.json \
  --shelley-kes-key /opt/cardano/block-producer/keys/kes.skey \
  --shelley-vrf-key /opt/cardano/block-producer/keys/vrf.skey \
  --shelley-operational-certificate /opt/cardano/block-producer/keys/node.cert

KillSignal=SIGINT
RestartKillSignal=SIGINT
TimeoutStopSec=300
LimitNOFILE=32768
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Start and Monitor

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable cardano-bp
sudo systemctl start cardano-bp

# Check status
sudo systemctl status cardano-bp

# Monitor logs
journalctl -u cardano-bp -f

# Verify block production
cardano-cli query leadership-schedule \
  --mainnet \
  --genesis shelley-genesis.json \
  --stake-pool-id $(cardano-cli stake-pool id --cold-verification-key-file cold.vkey) \
  --vrf-signing-key-file vrf.skey \
  --current
```

## Security Best Practices

### Key Management

1. **Cold keys**: Store offline on encrypted USB drives in multiple secure locations
2. **Payment keys**: Keep offline except when needed for transactions  
3. **KES keys**: Rotate before expiry, keep only on block producer
4. **VRF keys**: Required on block producer, backup securely

### Firewall Configuration

```bash
# Block all incoming except from your relays
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow only your relay IPs
sudo ufw allow from RELAY1_IP to any port 6000
sudo ufw allow from RELAY2_IP to any port 6000

# Allow SSH from specific IP only
sudo ufw allow from YOUR_ADMIN_IP to any port 22

sudo ufw enable
```

### Monitoring and Alerts

Set up monitoring for:
- KES key expiration (critical)
- Block production performance
- Node synchronization status
- System resources (CPU, memory, disk)
- Network connectivity to relays

## Common Issues

### No Blocks Produced

Verify:
1. Pool is registered and active (2 epochs after registration)
2. KES keys are not expired
3. System time is synchronized (use chrony/ntp)
4. Node is fully synchronized
5. Operational certificate is valid

### KES Key Expired

Generate new KES keys and operational certificate:
1. Increment the counter value
2. Generate new KES keys
3. Issue new operational certificate
4. Restart block producer with new keys

## Next Steps

After successful pool registration:
1. Wait 2 epochs for pool to become active
2. Monitor first block production
3. Set up automated KES rotation
4. Implement comprehensive monitoring
5. Create delegation marketing strategy
6. Consider multi-owner setup for larger pledges
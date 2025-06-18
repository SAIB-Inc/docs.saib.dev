---
title: Hardware Requirements
sidebar_position: 4
---

# Hardware Requirements

Running a Cardano stake pool requires reliable hardware that can handle continuous operation. This guide breaks down the minimum and recommended specifications for both mainnet and testnet deployments.

---

## Quick Reference

| Component | Testnet Minimum | Mainnet Minimum | Mainnet Recommended |
|-----------|-----------------|-----------------|---------------------|
| **CPU** | 2 cores | 4 cores | 8+ cores |
| **RAM** | 8 GB | 16 GB | 32 GB |
| **Storage** | 30 GB | 150 GB | 500 GB SSD |
| **Network** | 1 Mbps | 10 Mbps | 100 Mbps+ |

---

## Understanding the Requirements

### Why These Specifications Matter

Cardano nodes perform several resource-intensive tasks:
- **Processing transactions** from the global network
- **Validating blocks** from other stake pools
- **Storing the blockchain** history (currently ~110 GB and growing)
- **Creating new blocks** when selected as slot leader
- **Maintaining connections** with multiple peer nodes

:::warning Important
Under-specced hardware leads to:
- Missed block production (lost rewards)
- Poor propagation times (reduced rewards)
- Network instability
- Frustrated delegators
:::

---

## CPU Requirements

### Minimum: 4 Cores
- Intel Core i5 or AMD Ryzen 5 equivalent
- 2.0 GHz or higher base frequency
- x86_64 architecture (ARM is experimental)

### Recommended: 8+ Cores
- Intel Core i7/i9 or AMD Ryzen 7/9
- 3.0 GHz or higher base frequency
- Dedicated CPU (not shared/virtual)

### Why CPU Matters
The Cardano node uses CPU for:
- **Cryptographic operations**: Verifying signatures and VRF proofs
- **Block validation**: Processing incoming blocks quickly
- **Memory management**: Handling the in-memory blockchain state

:::tip Performance Tip
Higher single-thread performance often matters more than core count. A 6-core CPU at 4.0 GHz typically outperforms a 12-core CPU at 2.5 GHz for Cardano operations.
:::

---

## Memory (RAM) Requirements

### Minimum: 16 GB
- Sufficient for basic operation
- May experience slowdowns during high network activity
- Requires swap space configuration

### Recommended: 32 GB
- Smooth operation under all conditions
- Room for monitoring and auxiliary services
- Better caching of blockchain data

### Memory Usage Breakdown
```
Cardano Node:     12-14 GB
Operating System:  1-2 GB
Monitoring:        1-2 GB
Buffer/Cache:      Remaining
```

:::info Current Usage (2024)
As of late 2024, cardano-node typically uses 12-14 GB of RAM on mainnet. This will increase as the blockchain grows.
:::

---

## Storage Requirements

### Minimum: 150 GB SSD
- Current blockchain size: ~110 GB
- Growth rate: ~2-3 GB per month
- Additional space for logs and updates

### Recommended: 500 GB+ NVMe SSD
- Future-proof for blockchain growth
- Space for comprehensive logging
- Room for backups and snapshots

### Storage Performance
| Metric | Minimum | Recommended |
|--------|---------|-------------|
| Read Speed | 500 MB/s | 2000+ MB/s |
| Write Speed | 400 MB/s | 1500+ MB/s |
| IOPS | 50,000 | 200,000+ |

:::caution Avoid HDDs
Traditional hard drives are NOT suitable for stake pools. The random I/O patterns of blockchain operations require SSD performance.
:::

---

## Network Requirements

### Bandwidth
- **Minimum**: 10 Mbps symmetric
- **Recommended**: 100 Mbps symmetric
- **Data usage**: ~1 GB per hour (24 GB/day)

### Latency
- **To relay nodes**: &lt;50ms preferred
- **Geographic distribution**: Consider peer locations
- **Stable connection**: Minimal packet loss

### Network Configuration
```bash
# Required open ports
- 3001: Node-to-node communication
- 3000: Monitoring (optional)
- 22: SSH management
```

---

## Operating System

### Supported Systems
1. **Ubuntu** 20.04/22.04 LTS (recommended)
2. **Debian** 11/12
3. **CentOS Stream** 8/9
4. **RHEL** 8/9
5. **Fedora** 37+ (less common)

### Why Linux?
- Better resource efficiency
- Superior networking stack
- Extensive tooling support
- Community standard

:::info Windows/MacOS
While technically possible, Windows and MacOS are not recommended for production pools due to:
- Limited community support
- Performance overhead
- Tooling incompatibility
:::

---

## Virtual vs Physical Hardware

### VPS/Cloud (Acceptable)
✅ **Pros:**
- Easy scaling
- Built-in redundancy
- Professional networking
- Quick deployment

❌ **Cons:**
- Monthly costs
- Potential "noisy neighbors"
- Less control over hardware

### Dedicated Servers (Recommended)
✅ **Pros:**
- Full hardware control
- Predictable performance
- One-time hardware cost
- Complete isolation

❌ **Cons:**
- Upfront investment
- Maintenance responsibility
- Need backup power

### Home Servers (Possible)
✅ **Pros:**
- Complete control
- Lowest ongoing cost
- Learning opportunity

❌ **Cons:**
- Residential internet limitations
- Power/cooling concerns
- No built-in redundancy

---

## Cost Considerations

### Monthly Estimates (USD)
| Type | Low-End | Mid-Range | High-End |
|------|---------|-----------|----------|
| VPS/Cloud | $50-100 | $150-300 | $400+ |
| Colocation | $100-200 | $300-500 | $800+ |
| Home (Power) | $20-40 | $40-80 | $100+ |

### Total Investment
```
Initial Setup:
- Hardware: $1,000-5,000
- Time: 40-80 hours
- Training: Variable

Monthly Operating:
- Hosting: $50-500
- Internet: $50-150
- Monitoring: $0-50
- Time: 10-20 hours
```

---

## Platform-Specific Recommendations

### Popular VPS Providers
| Provider | Suitable Plans | Monthly Cost | Notes |
|----------|---------------|--------------|-------|
| **Contabo** | VPS L-XL | $20-60 | Budget option |
| **Hetzner** | AX41-AX101 | $50-200 | Good performance |
| **OVH** | Advance servers | $70-300 | DDoS protection |
| **AWS** | t3.xlarge+ | $150-500 | Enterprise features |

### Bare Metal Providers
- **Hetzner**: Excellent price/performance
- **OVH**: Strong DDoS protection
- **Equinix**: Premium connectivity
- **Local datacenters**: Often cost-effective

---

## Scaling Considerations

### Starting Small
Begin with minimum specifications if:
- Testing pool operation
- Limited initial budget
- Learning the ropes

### When to Upgrade
Consider upgrading when:
- Blockchain sync takes >30 minutes
- Memory usage exceeds 80%
- CPU regularly hits 100%
- Delegator stake grows significantly

---

## Multi-Node Setup

For production pools, consider:

### Block Producer
- Maximum specifications
- Redundant power supply
- ECC memory preferred
- Local backup solution

### Relay Nodes (2-3 recommended)
- Minimum specifications acceptable
- Geographic distribution
- Different providers
- Lower-cost options viable

---

## Monitoring Requirements

Reserve resources for:
- **Prometheus**: 1 GB RAM, 10 GB storage
- **Grafana**: 512 MB RAM, 1 GB storage
- **Alert Manager**: 256 MB RAM
- **Log aggregation**: Variable

---

## Future-Proofing

### Expected Growth
Plan for these trends:
- **Blockchain size**: +30-40 GB/year
- **Memory usage**: +2-3 GB/year
- **Network traffic**: Increasing with adoption
- **CPU requirements**: Stable with optimizations

### Hardware Lifecycle
- **Plan replacement**: Every 3-5 years
- **Monitor degradation**: SSD wear, fan failure
- **Keep spare parts**: For critical components
- **Document everything**: For smooth transitions

---

## Verification Commands

Check your system specifications:

```bash
# CPU information
lscpu | grep -E "Model name|Socket|Core|Thread"

# Memory information
free -h

# Disk information
df -h
lsblk

# Network speed test
speedtest-cli
```

---
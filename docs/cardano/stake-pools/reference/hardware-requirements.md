---
title: Hardware Requirements
sidebar_position: 4
---

# Hardware Requirements

Running a Cardano stake pool requires hardware that can handle continuous blockchain operations. This guide provides specific requirements based on real-world operations and official specifications.

## Minimum vs Recommended Specifications

The difference between minimum and recommended specs directly impacts your pool's performance and ability to win height battles when competing for the same slot.

### CPU Requirements

**Minimum Specification**
- 2 cores at 2GHz or faster (Intel/AMD x86_64)
- Sufficient for basic operation
- May struggle during high network activity

**Recommended Specification**
- 4-8 cores at 3GHz or faster
- Better single-thread performance preferred
- Dedicated CPU resources (not shared VPS)

To check your current CPU:
```bash
lscpu | grep -E "Model name|CPU\(s\)|Thread|MHz"
```

The cardano-node process is mostly single-threaded for block validation, making per-core performance more important than total core count. A 4-core CPU at 4GHz will outperform an 8-core CPU at 2GHz for Cardano operations.

### Memory (RAM) Requirements

**Minimum Specification**
- 24GB RAM for mainnet
- 4GB RAM for testnet
- Will use swap during peak times

**Recommended Specification**
- 32GB RAM for comfortable operation
- 64GB RAM for future-proofing
- ECC memory for production pools

Check current memory usage:
```bash
free -h
```

The cardano-node process currently uses 12-14GB of RAM on mainnet. This increases over time as the blockchain grows. Plan for 20% yearly growth in memory requirements.

### Storage Requirements

**Minimum Specification**
- 150GB SSD storage
- SATA SSD acceptable
- 500 MB/s read speeds

**Recommended Specification**
- 500GB NVMe SSD
- 2000+ MB/s read speeds
- 200,000+ IOPS

Check current blockchain size:
```bash
du -sh /path/to/cardano/db/
```

The Cardano blockchain currently requires approximately 110GB of storage. Growth rate is 2-3GB per month. Never use mechanical hard drives - the random I/O patterns will cause poor performance.

### Network Requirements

**Minimum Specification**
- 10 Mbps symmetric bandwidth
- Static IP preferred
- Low latency to peers

**Recommended Specification**
- 100 Mbps symmetric bandwidth
- Multiple IP addresses
- BGP peering for enterprises

Test your network performance:
```bash
# Check bandwidth
speedtest-cli

# Check latency to other pools (example)
ping -c 10 8.8.8.8
```

Cardano nodes typically use 20-30GB of bandwidth daily. During times of high activity, this can spike to 50GB/day.

## Operating System Requirements

Cardano nodes run on 64-bit Linux. Tested and supported distributions include:

**Ubuntu** (Recommended)
- 20.04 LTS
- 22.04 LTS
- 24.04 LTS

**Debian**
- 11 (Bullseye)
- 12 (Bookworm)

**RHEL/CentOS/Rocky**
- RHEL 8/9
- Rocky Linux 8/9
- AlmaLinux 8/9

Check your OS version:
```bash
cat /etc/os-release
```

Windows and macOS are not recommended for production pools due to performance overhead and limited community support.

## Infrastructure Options

### VPS/Cloud Providers

Popular choices with proven track records:

| Provider          | Service Type       | Monthly Cost | Specifications                         |
|-------------------|--------------------|--------------|-----------------------------------------|
| **Hetzner**       | AX41 Dedicated     | €39          | Ryzen 5 3600, 64GB RAM, 2x512GB NVMe   |
| **Contabo**       | Cloud VPS 6        | €21.99       | 12 vCPU, 48GB RAM, 600GB SSD           |
| **OVH**           | Advance-1          | $69          | Xeon 4C/8T, 32GB RAM, 2x450GB SSD      |
| **DigitalOcean**  | CPU-Optimized 8GB  | $84          | 4 vCPU, 8GB RAM, 100GB SSD             |

### Bare Metal Servers

Dedicated servers provide the best performance and control:

| Provider     | Model  | Monthly Cost | Specifications                               |
|--------------|--------|--------------|----------------------------------------------|
| **Hetzner**  | AX101  | €107         | AMD Ryzen 9 5950X, 128GB RAM, 2x3.84TB NVMe |
| **OVH**      | ADV-2  | $139         | Xeon 8C/16T, 64GB RAM, 2x450GB SSD          |
| **Equinix**  | Custom | $200+        | Enterprise-grade with SLA                    |

### Home Server Considerations

Running from home is possible but has challenges:

**Requirements**
- Business internet with static IP
- Uninterruptible Power Supply (UPS)
- Redundant internet connections
- Proper cooling/ventilation

**Challenges**
- Residential bandwidth limitations
- Power outage risks
- ISP terms of service
- 24/7 noise and heat

## Performance Benchmarks

Real-world performance metrics from production pools:

### Block Production Performance

```bash
# Check block production time
grep "Forged block" /path/to/node.log | tail -10
```

Target metrics:
- Block forging time: &lt;50ms
- Block adoption: &gt;98%
- Height battle wins: &gt;95%

### Sync Performance

Initial sync times by hardware tier:

| Hardware Tier | Sync Time   | Daily Catch-up |
|---------------|-------------|----------------|
| Minimum spec  | 18-24 hours | 30-45 minutes  |
| Recommended   | 8-12 hours  | 10-15 minutes  |
| High-end      | 4-6 hours   | 5-10 minutes   |

### Resource Usage Monitoring

Monitor your pool's resource usage:

```bash
# CPU usage
top -b -n 1 | grep cardano-node

# Memory usage
ps aux | grep cardano-node | awk '{print $6/1024 " MB"}'

# Disk I/O
iostat -x 1 5 | grep -A1 avg-cpu
```

## Cost Analysis

Total monthly costs for different configurations:

### Budget Configuration
- 3x Contabo Cloud VPS 3: €36/month
- Monitoring VPS: $15/month
- **Total: €51/month**

### Standard Configuration  
- 1x Hetzner AX41: €39/month
- 2x Cloud VPS: $60/month
- **Total: ~$105/month**

### Premium Configuration
- 1x Hetzner AX101: €107/month
- 2x OVH ADV-1: $200/month
- Monitoring: $40/month
- **Total: ~$360/month**

## Scaling Considerations

Plan for growth from day one:

### Starting Small
If budget is limited:
1. Begin with minimum specs on testnet
2. Use one relay initially
3. Upgrade as delegation grows
4. Add relays in different regions

### When to Upgrade

Monitor these indicators:
```bash
# Check if memory usage >80%
free -m | awk 'NR==2{printf "Memory Usage: %.0f%%\n", $3*100/$2}'

# Check if CPU usage >70% average
top -b -n 5 -d 1 | grep "Cpu(s)" | awk '{print $2}' | awk '{sum+=$1} END {print "CPU Average:", sum/NR"%"}'
```

Upgrade when:
- Memory usage consistently >80%
- CPU usage average >70%
- Sync time increases significantly
- Block production delays occur

## Getting Started with Hardware

Before purchasing hardware:

1. **Start with testnet**: Use minimal specs to learn
2. **Research providers**: Compare prices and reliability
3. **Plan for growth**: Consider future blockchain size
4. **Budget wisely**: Include monthly costs in your planning

Remember: You don't need the most expensive hardware to run a successful pool. Start with reliable basics and upgrade as your pool grows.
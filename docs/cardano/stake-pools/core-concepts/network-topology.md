---
title: Network Topology
sidebar_position: 3
---

# Network Topology

Network topology defines how your stake pool nodes connect to each other and the broader Cardano network. A well-designed topology ensures reliability, security, and optimal block propagation.

## Topology Fundamentals

### What is Topology?

In Cardano, topology refers to:
- Which nodes connect to which other nodes
- The direction of these connections (incoming/outgoing)
- The geographic and network distribution of nodes
- The security boundaries between node types

### Why Topology Matters

Your topology directly impacts:
- **Security**: Protecting block producer from attacks
- **Performance**: How fast your blocks propagate
- **Reliability**: Resilience to node or network failures  
- **Decentralization**: Contributing to network health

## Basic Topology Patterns

### Minimum Viable Topology

The simplest secure topology:

```
         ┌──────────────┐
         │Block Producer│
         │  (Private)   │
         └──────┬───────┘
                │
        ┌───────┴────────┐
        │                │
   ┌────▼─────┐    ┌─────▼────┐
   │ Relay 1  │    │ Relay 2  │
   │ (Public) │    │ (Public) │
   └────┬─────┘    └─────┬────┘
        │                │
        └────────────────┘
                │
        Cardano Network
```

**Characteristics:**
- 1 block producer (BP)
- 2 relay nodes minimum
- BP only connects to own relays
- Relays connect to BP and external nodes

### Recommended Production Topology

For production pools:

```
                ┌──────────────┐
                │Block Producer│
                │   (Private)  │
                └──────┬───────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    ┌─────▼────┐ ┌─────▼────┐ ┌────▼─────┐
    │ Relay 1  │ │ Relay 2  │ │ Relay 3  │
    │  (USA)   │ │   (EU)   │ │  (Asia)  │
    └─────┬────┘ └─────┬────┘ └────┬─────┘
          │            │            │
          └────────────┼────────────┘
                       │
               Cardano Network
```

**Benefits:**
- Geographic distribution
- Better global propagation
- Redundancy across regions
- Resilient to regional issues

## Topology Configuration

### Block Producer Configuration

The block producer's topology file should ONLY list your relays:

```json
{
  "Producers": [
    {
      "addr": "relay1.yourpool.com",
      "port": 3001,
      "valency": 1
    },
    {
      "addr": "relay2.yourpool.com",
      "port": 3001,
      "valency": 1
    }
  ]
}
```

**Key Points:**
- No public pool entries
- Use DNS names or static IPs
- Valency = 1 (one connection per entry)
- Different port possible for security

### Relay Node Configuration

Relays need diverse connections:

```json
{
  "Producers": [
    {
      "addr": "10.0.0.1",
      "port": 3000,
      "valency": 1
    },
    {
      "addr": "relays-new.cardano-mainnet.iohk.io",
      "port": 3001,
      "valency": 2
    },
    {
      "addr": "other-pool-relay.com",
      "port": 3001,
      "valency": 1
    }
  ]
}
```

**Includes:**
- Your block producer (private IP)
- IOHK bootstrap relays
- Other pool relays
- Community relays

## P2P vs Legacy Topology

### Legacy (Manual) Topology

Traditional topology requires manual peer management:

**Pros:**
- Full control over connections
- Predictable peer set
- Easier debugging

**Cons:**
- Manual maintenance
- Static connections
- Requires peer exchange

### P2P (Automatic) Topology

Modern P2P mode enables automatic peer discovery:

```json
{
  "localRoots": [
    {
      "accessPoints": [
        {"address": "bp.yourpool.com", "port": 3000}
      ],
      "advertise": false,
      "valency": 1
    }
  ],
  "publicRoots": [
    {
      "accessPoints": [
        {"address": "relays-new.cardano-mainnet.iohk.io", "port": 3001}
      ],
      "advertise": false
    }
  ],
  "useLedgerAfterSlot": 0
}
```

**Benefits:**
- Automatic peer discovery
- Dynamic optimization
- Improved decentralization
- Reduced maintenance

## Geographic Distribution

### Why Distribute Globally

Geographic distribution provides:
- **Faster propagation**: Blocks reach global nodes quicker
- **Network resilience**: Survives regional outages
- **Regulatory safety**: Not dependent on single jurisdiction
- **DDoS resistance**: Harder to attack all locations

### Optimal Distribution Pattern

```
┌─────────────────────────────────────┐
│         Global Distribution         │
├─────────────────────────────────────┤
│                                     │
│  USA-East    Europe    Asia-Pacific │
│     ●          ●           ●        │
│   Relay 1   Relay 2     Relay 3    │
│                                     │
│         Block Producer              │
│            ● (Any secure location)  │
└─────────────────────────────────────┘
```

### Latency Considerations

Target latencies:
- **BP ↔ Relay**: &lt; 50ms (critical)
- **Relay ↔ Relay**: &lt; 150ms (important)
- **Relay ↔ Network**: &lt; 200ms (acceptable)

## Security Topology

### Network Segmentation

Implement security zones:

```
┌─────────────────────────┐
│   DMZ (Public Zone)     │
│  ┌─────┐    ┌─────┐    │
│  │Relay│    │Relay│    │
│  └──┬──┘    └──┬──┘    │
└─────┼──────────┼───────┘
      │          │
   Firewall   Firewall
      │          │
┌─────┼──────────┼───────┐
│  Private Network Zone   │
│     └────┬─────┘       │
│          │             │
│   ┌──────▼──────┐      │
│   │Block Producer│      │
│   └─────────────┘      │
└────────────────────────┘
```

### Firewall Rules

#### Block Producer Firewall
```bash
# Incoming - Only from your relays
iptables -A INPUT -s RELAY1_IP -p tcp --dport 3000 -j ACCEPT
iptables -A INPUT -s RELAY2_IP -p tcp --dport 3000 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -j DROP

# Outgoing - Only to your relays
iptables -A OUTPUT -d RELAY1_IP -p tcp --dport 3001 -j ACCEPT
iptables -A OUTPUT -d RELAY2_IP -p tcp --dport 3001 -j ACCEPT
```

#### Relay Firewall
```bash
# Incoming - Open to Cardano network
iptables -A INPUT -p tcp --dport 3001 -j ACCEPT

# Rate limiting
iptables -A INPUT -p tcp --dport 3001 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 3001 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 -j DROP
```

## Advanced Topology Patterns

### Hidden Relay Pattern

Add a hidden relay between public relays and BP:

```
        Public Zone          Private Zone
    ┌─────┐    ┌─────┐      ┌─────┐     ┌────┐
    │Relay│    │Relay│      │Hidden│     │ BP │
    │  1  │───►│  2  │─────►│Relay│────►│    │
    └─────┘    └─────┘      └─────┘     └────┘
        ▲         ▲
        │         │
    Internet  Internet
```

**Benefits:**
- Extra security layer
- Filters malicious traffic
- Reduces BP exposure

### Multi-Region Redundancy

Deploy redundant infrastructure:

```
Region A                Region B
┌─────────┐            ┌─────────┐
│ Relay A1│            │ Relay B1│
│ Relay A2├────────────┤ Relay B2│
└────┬────┘            └────┬────┘
     │                      │
     └──────┐      ┌────────┘
            │      │
         ┌──▼──────▼──┐
         │Block Producer│
         └────────────┘
```

## Topology Best Practices

### DO's ✅

1. **Diversify relay providers**
   - Use different hosting companies
   - Mix cloud and bare metal
   - Avoid single points of failure

2. **Monitor all connections**
   - Track peer counts
   - Alert on disconnections
   - Log topology changes

3. **Regular topology updates**
   - Add new community peers
   - Remove dead peers
   - Optimize based on metrics

4. **Use DNS where possible**
   - Easier updates
   - Supports failover
   - More flexible

### DON'Ts ❌

1. **Don't expose block producer**
   - Never in public topology
   - No direct internet access
   - Firewall everything

2. **Don't use same provider for all**
   - Creates single failure point
   - Vulnerable to provider issues
   - Poor geographic distribution

3. **Don't neglect monitoring**
   - Topology issues compound
   - Early detection critical
   - Automate alerts

## Troubleshooting Topology

### Common Issues

#### "No peers connected"
```bash
# Check node status
cardano-cli query tip --mainnet

# Verify topology file
cat /path/to/topology.json

# Check firewall rules
sudo iptables -L -n
```

#### "Block propagation slow"
- Add more geographic diversity
- Check relay peer counts
- Verify network latency
- Consider P2P mode

#### "Relay keeps disconnecting"
- Check firewall timeouts
- Verify DNS resolution
- Monitor network stability
- Review peer quality

## Monitoring Topology

### Key Metrics

Monitor these continuously:
- **Peer count**: Should be stable
- **Propagation time**: &lt;5 seconds target
- **Connection drops**: Should be minimal
- **Geographic coverage**: Well distributed

### Useful Commands

```bash
# Check peer connections
echo "peers" | nc -q 1 localhost 12798 | jq '.peers'

# Monitor live connections
watch -n 5 'ss -tn | grep :3001 | wc -l'

# Test connectivity
nc -zv relay.yourpool.com 3001
```

## Future Considerations

### Ouroboros Genesis

Future protocol updates will enable:
- Dynamic availability
- Self-healing topology
- Enhanced peer selection
- Improved security

### Network Growth

Plan for:
- Increasing peer counts
- Higher bandwidth needs
- More sophisticated attacks
- Enhanced monitoring needs

---
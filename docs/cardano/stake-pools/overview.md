---
title: Overview
sidebar_position: 1
---

# Stake Pool Overview

Running a Cardano stake pool means operating infrastructure that validates transactions and produces blocks for the blockchain. This guide provides engineers with the technical foundation needed to assess whether stake pool operation aligns with their capabilities and goals.

## What Is a Stake Pool?

A stake pool is a reliable server configuration that participates in the Cardano consensus protocol. When the Ouroboros algorithm selects your pool to produce a block, your infrastructure must be online and ready to respond within seconds. The selection probability depends on the total ADA delegated to your pool compared to the network total.

The architecture requires multiple components working together. Your block producer node remains isolated from the internet, holding the cryptographic keys needed to sign blocks. This sensitive component connects only to your relay nodes, which handle all external network communication. This separation provides both security and resilience.

## Technical Requirements

Operating a stake pool demands competence in Linux server administration. You'll manage multiple servers, configure networking, implement security measures, and maintain uptime targets above 95%. The learning curve is steep but manageable for engineers with systems administration experience.

Hardware requirements for mainnet production start at 4 CPU cores, 32GB RAM, and 500GB SSD storage per node. Network bandwidth should support sustained 100Mbps throughput. While testnet operations can run on lighter hardware, production deployments benefit from headroom for network growth and peak loads.

The minimum viable deployment includes one block producer and two relay nodes across different network providers or geographic locations. An additional air-gapped system handles cold key generation and signing operations. Budget approximately $300-400 monthly for infrastructure costs.

## Understanding the Economics

The Cardano protocol enforces a minimum fixed fee of 170 ADA per epoch (5 days) that goes directly to the pool operator. Operators also set a variable margin percentage applied to remaining rewards after the fixed fee. This two-tier fee structure ensures operators can cover basic costs even with modest delegation.

Rewards flow from the protocol's monetary expansion, currently set at 0.3% per epoch distributed to all stake pools proportional to their active stake. The protocol directs 20% to the treasury, with the remainder distributed as staking rewards. Your pool earns rewards only when selected to produce blocks, making consistent operation critical.

Breaking even depends on attracting sufficient delegation. With current parameters, a pool needs approximately 1-2 million ADA delegated to cover typical infrastructure costs through the minimum fixed fee alone. Margin fees provide profit above this baseline.

## Operational Considerations

Running a stake pool is a commitment to infrastructure reliability. The network depends on operators maintaining their pools through software updates, responding to issues promptly, and participating in network upgrades. Expect to spend 3-5 hours weekly on routine maintenance, with additional time needed for learning and community participation.

Key generation and management require particular attention. You'll handle multiple key types with different security requirements. Cold keys controlling pool ownership stay offline, while operational keys on the block producer rotate every 90 days. Losing keys or exposing them to compromise can result in permanent loss of your pool identity or funds.

The delegation mechanism introduces a delay between attracting stake and earning rewards. After a delegator chooses your pool, the protocol waits for the next epoch boundary, takes a snapshot, then activates that stake in the following epoch. First rewards calculate one epoch later and distribute in the subsequent epoch. This 15-20 day delay challenges new pools trying to demonstrate their reliability.

## Getting Started

Begin your stake pool journey on testnet. The preview and preprod networks mirror mainnet's behavior while using test ADA with no monetary value. This environment lets you practice operations, test your procedures, and verify your understanding without financial risk.

Set up monitoring and alerting early in your testnet phase. Your pool's reputation depends on consistent block production when selected. Missing assigned slots due to downtime or misconfiguration directly impacts delegator rewards and trust.

Join the stake pool operator community through Telegram groups, Discord servers, and the Cardano Forum. Experienced operators share knowledge freely, and the community provides support for technical challenges. Building relationships also helps when you need to configure peer connections for your topology.

## Technical Implementation Path

Start with the [Pool Architecture](/docs/cardano/stake-pools/reference/pool-architecture) reference to understand component relationships and network topology. The [Cryptographic Keys](/docs/cardano/stake-pools/reference/cryptographic-keys) guide explains the various keys and their security requirements.

When ready to build, follow the [Getting Started](/docs/cardano/stake-pools/getting-started/requirements) guides for detailed setup procedures. The [Configuration](/docs/cardano/stake-pools/configuration/relay-configuration) section provides specific instructions for relay and block producer setup.

For ongoing operations, the [Reference](/docs/cardano/stake-pools/reference/hardware-requirements) section contains detailed specifications and troubleshooting guidance.

## Making the Decision

Successful stake pool operation requires technical skill, financial resources, time commitment, and community engagement. The network benefits from diverse, independent operators committed to long-term participation. If you possess the necessary skills and resources, running a stake pool offers a unique opportunity to support Cardano's decentralization while building a sustainable operation.

Engineers comfortable with infrastructure operations, interested in blockchain consensus mechanisms, and committed to reliability make ideal stake pool operators. The initial learning investment pays dividends through deep understanding of Cardano's technical architecture and participation in its ecosystem.
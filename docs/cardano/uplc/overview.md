---
title: Overview
sidebar_position: 1
---

# What is UPLC?

Untyped Plutus Core (UPLC) is the low-level programming language that powers all smart contracts on the Cardano blockchain. Think of it as the assembly language of Cardano—while you'll rarely write UPLC directly, understanding it helps you grasp how your smart contracts actually execute on-chain.

## The Foundation of Cardano Smart Contracts

When you write a smart contract in Aiken, Plutus, or any other high-level language for Cardano, your code ultimately compiles down to UPLC. This compiled UPLC code is what validators on the Cardano network actually execute to determine whether a transaction should succeed or fail.

UPLC serves as the common denominator for all Cardano smart contract languages. No matter which language you choose for development, they all compile to the same UPLC representation, ensuring consistent execution across the network.

## Why "Untyped"?

The "untyped" in UPLC might seem counterintuitive if you're coming from typed languages like Haskell or TypeScript. In UPLC, there's no compile-time type checking—the language doesn't enforce that you're adding two integers or concatenating two strings. Instead, operations either succeed at runtime or fail with an error.

This design choice makes UPLC simpler and more efficient to execute on-chain. Type checking happens in the high-level languages before compilation, not during on-chain execution where every computational step costs ADA.

## Core Characteristics

UPLC is a functional programming language at its core. Every UPLC program is an expression that evaluates to a value. There are no statements, no mutable variables, and no side effects—just pure computation.

The language is deliberately minimal. It includes only the essential features needed for smart contract execution: lambda abstractions (functions), function application, built-in functions for common operations, variables, and basic error handling. This minimalism keeps on-chain execution costs predictable and auditable.

## Execution Model

UPLC programs execute through a process called reduction. The evaluator repeatedly applies reduction rules to simplify expressions until it reaches a final value or encounters an error. This deterministic evaluation ensures that every validator on the network reaches the same conclusion about whether a transaction is valid.

The execution environment provides a set of built-in functions for operations like arithmetic, cryptographic verification, and data manipulation. These built-ins are implemented natively for efficiency, as they handle the computationally intensive operations that smart contracts commonly need.

## Practical Implications

Understanding UPLC helps you write more efficient smart contracts. When you know that your high-level code compiles to UPLC, you can make informed decisions about algorithmic complexity and data structure choices. You'll understand why certain patterns are more gas-efficient than others.

For debugging complex issues, being able to read UPLC can be invaluable. When a smart contract fails in unexpected ways, examining the compiled UPLC often reveals the root cause more clearly than debugging at the high-level language layer.

## Next Steps

Now that you understand what UPLC is and why it matters, you're ready to explore its syntax and structure. The following sections will guide you through reading and understanding UPLC code, working with its data types, and using the available built-in functions.

While you may never write UPLC by hand, the knowledge you gain here will make you a more effective Cardano developer, capable of optimizing your smart contracts and diagnosing issues at the deepest level of the execution stack.
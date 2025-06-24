---
title: Evaluation Model
sidebar_position: 5
---

# Evaluation Model

Understanding how UPLC programs execute is essential for writing efficient smart contracts and diagnosing validation failures. UPLC uses a deterministic evaluation model that ensures every validator on the Cardano network reaches the same conclusion about transaction validity.

---

## The CEK Machine

UPLC evaluation is based on the CEK machine—a well-studied abstract machine for evaluating lambda calculus. CEK stands for:

- **C**ontrol: The current term being evaluated
- **E**nvironment: Bindings from variables to values
- **K**ontinuation: What to do with the result (the "call stack")

This machine provides a precise, step-by-step evaluation strategy that balances efficiency with predictability.

---

## Evaluation Strategy

UPLC uses call-by-value evaluation with the following key characteristics:

### Strict Evaluation

Arguments are fully evaluated before being passed to functions. When you see:

```
[ (lam x body) argument ]
```

The `argument` is completely evaluated to a value before substitution into `body`. This strictness ensures predictable cost models but means you can't create infinite data structures.

### Left-to-Right Order

In applications with multiple arguments:

```
[ [ f a ] b ]
```

Evaluation proceeds left-to-right:
1. Evaluate `f` to a value
2. Evaluate `a` to a value
3. Apply `f` to `a`, getting a new function
4. Evaluate `b` to a value
5. Apply the result of step 3 to `b`

### Environment and Closures

When a lambda abstraction is evaluated, it captures its current environment, creating a closure:

```
(let x = 5 in (lam y (addInteger x y)))
```

The lambda captures `x = 5` in its closure, so it can access this binding even when applied elsewhere in the program.

---

## Reduction Rules

The CEK machine applies these reduction rules until reaching a value or error:

### Beta Reduction

The fundamental rule of lambda calculus:

```
[ (lam x body) value ] → body[x := value]
```

This substitutes the value for all occurrences of `x` in `body`.

### Built-in Application

When a built-in function has all its arguments:

```
[ [ (builtin addInteger) 2 ] 3 ] → 5
```

The built-in executes its native implementation.

### Force-Delay

These operations handle suspended computations:

```
(force (delay term)) → term
```

Delay wraps a computation; force unwraps and evaluates it.

### Error Propagation

If any subterm evaluates to an error, the entire program fails:

```
[ f (error) ] → error
```

Errors cannot be caught or handled—they immediately terminate evaluation.

---

## Cost Model

Every evaluation step has an associated cost, measured in two dimensions:

### CPU Units

Computational steps consume CPU units based on:
- Term inspection and pattern matching
- Environment lookups
- Built-in function execution
- Memory allocation for intermediate values

### Memory Units

Memory consumption tracks:
- Size of values in the environment
- Intermediate values during computation
- Stack depth for nested applications

The cost model is deterministic—the same program always consumes the same resources, regardless of the machine executing it.

---

## Execution Phases

A complete UPLC execution follows these phases:

### 1. Deserialization

The binary UPLC encoding is parsed into the term structure. This happens once per script, with the result cached for multiple validations in the same transaction.

### 2. Application of Arguments

For validator scripts, three arguments are applied:
1. Datum (from the UTxO being spent)
2. Redeemer (from the transaction input)
3. Script context (transaction details)

Each application follows standard evaluation rules.

### 3. Evaluation to Normal Form

The CEK machine reduces the term until reaching either:
- A value (success for validators returning `()`)
- An error (validation failure)
- Resource exhaustion (exceeding CPU or memory limits)

### 4. Result Interpretation

For validator scripts:
- Returning `()` means the transaction is valid
- Any error means validation failed
- Resource exhaustion also causes failure

---

## Common Evaluation Patterns

### Recursive Functions

Without built-in recursion, UPLC uses the Y combinator pattern:

```
Y = λf. (λx. f (x x)) (λx. f (x x))
```

This creates fixed points, enabling recursive definitions. However, recursion is expensive—each recursive call adds to the evaluation cost.

### Short-Circuit Evaluation

The `ifThenElse` built-in only evaluates the selected branch:

```
[ [ [ (builtin ifThenElse) True ] expensive ] cheap ]
```

Here, `expensive` is never evaluated, saving resources.

### Partial Application

Built-ins can be partially applied:

```
(let addFive = [ (builtin addInteger) 5 ] in ...)
```

This creates reusable partially-applied functions without repeatedly specifying common arguments.

---

## Performance Optimization

Understanding evaluation helps optimize smart contracts:

### Minimize Evaluation Steps

Every reduction step costs CPU units. Simplify expressions where possible:

```
-- Expensive: evaluates addInteger twice
[ [ (builtin addInteger) [ [ (builtin addInteger) 1 ] 2 ] ] 3 ]

-- Cheaper: pre-compute constants off-chain
[ [ (builtin addInteger) 3 ] 3 ]
```

### Share Common Subexpressions

Use let-bindings (or their desugared lambda form) to evaluate expensive expressions once:

```
(lam x 
  [ [ (builtin addInteger) x ] x ]  -- x evaluated once, used twice
)
```

### Avoid Deep Recursion

Each recursive call increases memory usage. Use tail recursion or accumulator patterns when possible.

### Leverage Laziness Carefully

While UPLC is strict, `delay` and `force` provide controlled laziness. Use them to defer expensive computations that might not be needed.

---

## Debugging Evaluation

When scripts fail, understanding evaluation helps diagnose issues:

1. **Type Mismatches**: Usually surface immediately when applying built-ins
2. **Missing Arguments**: Partially applied functions waiting for more arguments
3. **Resource Exhaustion**: Deep recursion or expensive operations exceeding limits
4. **Logic Errors**: Correct types but wrong values, requiring trace analysis

Tools like Aiken's UPLC evaluator can step through execution, showing each reduction and its cost.

---

## Determinism Guarantees

UPLC evaluation is completely deterministic:

- Same program + same inputs = same result
- No randomness or external effects
- No timing variations or race conditions
- Identical evaluation across all network nodes

This determinism is crucial for consensus—every node must agree on transaction validity.

---

## Practical Implications

When writing high-level smart contracts, remember:

1. Your code compiles to UPLC following these evaluation rules
2. Optimization at the high level translates to UPLC efficiency
3. Understanding evaluation helps predict and minimize costs
4. Debugging often requires thinking about UPLC-level execution

The evaluation model might seem complex, but its predictability and determinism provide the foundation for Cardano's reliable smart contract platform. Master these concepts, and you'll write more efficient, cost-effective smart contracts.

---
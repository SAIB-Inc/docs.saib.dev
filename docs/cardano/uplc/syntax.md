---
title: Syntax
sidebar_position: 2
---

# Syntax

Understanding UPLC syntax is essential for debugging smart contracts and optimizing their on-chain execution. While you'll rarely write UPLC by hand, recognizing its structure helps you interpret compiled output and diagnose issues at the lowest level of Cardano's execution stack.

## Program Structure

Every UPLC program starts with a `program` declaration that specifies the Plutus Core version. The current version is 2.0.0, and this version information ensures compatibility across the Cardano network.

```
(program 2.0.0
  <term>
)
```

The program wraps a single term that represents your entire smart contract logic. This term evaluates to produce the final result.

## Terms and Expressions

UPLC is built on lambda calculus, where everything is an expression that evaluates to a value. The language provides several fundamental constructs:

### Variables

Variables in UPLC use De Bruijn indices—a numbering system that refers to lambda bindings by their distance from the variable usage. This eliminates naming conflicts and simplifies the evaluation model.

```
(var 0)  -- References the innermost lambda parameter
(var 1)  -- References the second innermost parameter
```

### Lambda Abstractions

Functions in UPLC are created using the `lam` keyword. Each lambda takes exactly one parameter, but you can nest lambdas to create multi-parameter functions.

```
(lam x <body>)
```

The parameter name (`x` in this example) is purely for readability in the textual representation. During evaluation, these names are converted to De Bruijn indices.

### Function Application

Function application uses square brackets to apply a function to an argument:

```
[ <function> <argument> ]
```

For functions with multiple parameters, you apply arguments one at a time:

```
[ [ <function> <arg1> ] <arg2> ]
```

### Constants

UPLC supports seven primitive types as constants, each with specific syntax:

```
(con unit ())                          -- Unit type
(con bool True)                        -- Boolean
(con integer 42)                       -- Integer
(con bytestring #68656c6c6f)          -- Bytestring (hex)
(con string "hello")                   -- UTF-8 string
(con pair < integer, bool > (42, True)) -- Pair
(con list < integer > [1, 2, 3])      -- List
```

Notice how compound types (pairs and lists) specify their element types between angle brackets.

### Built-in Functions

Built-in functions provide essential operations that would be inefficient or impossible to implement in pure UPLC. They're invoked using the `builtin` keyword:

```
(builtin addInteger)
(builtin sha2_256)
(builtin verifyEd25519Signature)
```

### Force and Delay

These special operations handle polymorphic types and control evaluation:

- `delay` defers the evaluation of a term
- `force` triggers the evaluation of a delayed term

```
(delay <term>)     -- Wrap term for later evaluation
(force <term>)     -- Evaluate a delayed term
```

These operations are crucial for implementing recursive functions and handling polymorphic built-ins.

### Error Handling

UPLC provides a simple error mechanism. When an error occurs, evaluation stops immediately:

```
(error)
```

There's no error recovery or exception handling—errors are terminal.

## Complete Example

Here's a simple UPLC program that adds two integers:

```
(program 2.0.0
  [ [ (builtin addInteger) (con integer 2) ] (con integer 3) ]
)
```

This program:
1. Gets the `addInteger` built-in function
2. Applies it to the integer constant 2
3. Applies the result to the integer constant 3
4. Returns 5

## Syntax Conventions

When reading UPLC, remember these conventions:

- Parentheses group expressions and aren't part of the syntax itself
- Whitespace is insignificant except for separating tokens
- Comments aren't supported in the core language
- All operations are prefix notation (operator comes first)

## Textual vs Binary Representation

The syntax shown here represents UPLC's human-readable form. On-chain, UPLC programs are encoded in a compact binary format called "flat" encoding. This binary representation:

- Reduces storage size significantly
- Eliminates parsing overhead during validation
- Preserves the exact program semantics

Tools like Aiken's CLI can convert between these representations, allowing you to inspect on-chain code in readable form.

## Next Steps

Now that you understand UPLC syntax, you're ready to explore how these syntactic elements map to actual data types and values during execution. The next section covers UPLC's type system and how values are represented during smart contract execution.
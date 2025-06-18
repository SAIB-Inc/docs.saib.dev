---
title: Installation
sidebar_position: 1
---

# Installing Aiken

This guide will walk you through installing Aiken and setting up your development environment. The installation includes the Aiken compiler, package manager, and development tools needed to start building smart contracts on Cardano.

---

## Prerequisites

Before you begin, ensure you have:

- A Unix-like operating system (Linux, macOS, or WSL on Windows)
- Basic knowledge of functional programming concepts
- Understanding of Cardano's eUTxO model
- Git installed on your system

---

## Installation Methods

Aiken provides multiple installation methods to accommodate different operating systems and user preferences. Choose the method that best fits your system and comfort level.

### Using the Official Installer (Recommended)

The official installer is the recommended method for most users, providing a streamlined installation experience that works across all Unix-like systems. This method uses a shell script that automatically detects your system configuration and installs the appropriate binaries.

```bash
curl -sSfL https://install.aiken-lang.org | bash
```

**What this installer does:**
1. **System Detection**: Automatically detects your operating system (Linux, macOS) and architecture (x86_64, ARM64)
2. **Binary Download**: Downloads the pre-compiled Aiken binaries optimized for your system
3. **Installation**: Places the binaries in `~/.aiken/bin` by default, avoiding conflicts with system packages
4. **Path Configuration**: Provides instructions for adding Aiken to your PATH if needed

**Components installed:**
- **Aiken Compiler** (`aiken`): The main executable that compiles `.ak` files to Plutus Core
- **Package Manager**: Integrated into the aiken command for managing dependencies
- **Language Server**: For IDE integration and development tools
- **Documentation Generator**: For creating project documentation

**Installation directory structure:**
```
~/.aiken/
├── bin/
│   └── aiken          # Main executable
├── share/
│   └── completions/   # Shell completion files
└── lib/
    └── stdlib/        # Standard library files
```

**Post-installation verification:**
After installation, the script will display the installed version and provide PATH configuration instructions if needed. The installer is idempotent, meaning you can safely run it multiple times without issues.

### Alternative Installation Methods

#### Using Homebrew (macOS)

Homebrew is a popular package manager for macOS that simplifies software installation and updates. If you're already using Homebrew for other development tools, this method integrates Aiken seamlessly into your existing workflow.

```bash
brew tap aiken-lang/homebrew-aiken
brew install aiken
```

**Advantages of Homebrew installation:**
- **Automatic Updates**: Update Aiken alongside other tools with `brew upgrade`
- **Dependency Management**: Homebrew handles any system dependencies automatically
- **Clean Uninstall**: Remove Aiken completely with `brew uninstall aiken`
- **Version Management**: Switch between versions using `brew switch`

**What happens during installation:**
1. The `tap` command adds the Aiken repository to your Homebrew sources
2. Homebrew downloads the appropriate binary for your macOS version
3. Installs Aiken in `/usr/local/bin` (Intel) or `/opt/homebrew/bin` (Apple Silicon)
4. Automatically configures PATH (if Homebrew is properly set up)

**Managing your installation:**
```bash
# Update to latest version
brew upgrade aiken

# Check installed version
brew info aiken

# See all available versions
brew list --versions aiken
```

#### Building from Source

Building from source gives you maximum control over the installation process and allows you to contribute to Aiken development. This method requires Rust toolchain and is recommended for developers who want to modify Aiken or use bleeding-edge features.

**Prerequisites for building:**
- Rust toolchain (1.70 or later)
- Git
- C compiler (gcc, clang, or MSVC)
- Around 2GB of free disk space

```bash
# Clone the repository
git clone https://github.com/aiken-lang/aiken.git
cd aiken

# Build in release mode for optimal performance
cargo build --release

# Optional: Run tests to verify the build
cargo test

# Install to your local bin directory
cargo install --path .
```

**Build customization options:**
```bash
# Build with specific features
cargo build --release --features "feature1,feature2"

# Build for a different target architecture
cargo build --release --target x86_64-unknown-linux-gnu

# Build with debugging symbols
cargo build --release --debug
```

**After building from source:**
- The binary will be in `target/release/aiken`
- Copy it to a directory in your PATH, or
- Use `cargo install --path .` to install it in `~/.cargo/bin`
- Ensure `~/.cargo/bin` is in your PATH

**Advantages of building from source:**
- Access to latest unreleased features
- Ability to apply custom patches
- Learning opportunity to understand Aiken internals
- Contributing back to the project

---

## Verify Installation

After installation, verify Aiken is properly installed:

```bash
aiken --version
```

You should see output like:
```
aiken v1.0.26-alpha+7ae2e4b
```

---

## Setting Up Your Environment

After successfully installing Aiken, the next crucial step is configuring your development environment for an optimal coding experience. A well-configured environment significantly improves productivity through features like syntax highlighting, auto-completion, error detection, and integrated documentation. This section covers editor configuration and shell enhancements that will streamline your Aiken development workflow.

### Code Editor Configuration

Aiken provides first-class support for modern code editors through the Language Server Protocol (LSP), an industry standard that enables advanced IDE features. The Aiken language server offers real-time error checking as you type, intelligent code completion based on context, inline documentation and type information, automated code formatting, and go-to-definition navigation. These features transform your editor into a powerful Aiken development environment, catching errors early and accelerating your development process.

Configure your preferred editor:

#### VS Code
1. Install the Aiken extension from the marketplace
2. Extension will automatically detect `.ak` files

#### Neovim
Add Aiken LSP to your configuration:
```lua
require'lspconfig'.aiken.setup{}
```

#### Other Editors
- **Emacs**: Use lsp-mode with Aiken
- **Sublime Text**: Install the Aiken package
- **IntelliJ**: Use the Aiken plugin

### Shell Completion

Shell completion is a powerful feature that enhances your command-line experience when working with Aiken. It provides intelligent suggestions as you type commands, saving time and reducing errors. When enabled, pressing the Tab key will automatically complete commands, suggest available options and flags, show possible file paths for your project, and display parameter hints for complex commands.

This feature is particularly valuable when learning Aiken, as it helps you discover available commands and their options without constantly referring to documentation. It also speeds up your workflow by reducing the amount of typing required for common operations.

Enable shell completion for your shell:

```bash
# Bash
aiken completion bash > ~/.aiken-completion.bash
echo "source ~/.aiken-completion.bash" >> ~/.bashrc

# Zsh
aiken completion zsh > ~/.aiken-completion.zsh
echo "source ~/.aiken-completion.zsh" >> ~/.zshrc

# Fish
aiken completion fish > ~/.config/fish/completions/aiken.fish
```

---

## Next Steps

Now that you have Aiken installed, you can:
- [Create your first project](./sample-project)
- Learn about the Aiken language syntax
- Explore the package ecosystem
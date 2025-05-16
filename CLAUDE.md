# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a documentation website for Softwarez at its Best, Inc. (SAIB) developer portal, built using [Docusaurus](https://docusaurus.io/). The site serves as a central hub for documentation on various SAIB products related to Cardano blockchain development:

- **Chrysalis**: .NET building blocks for Cardano development
- **Argus**: .NET indexing framework for Cardano
- **Razor**: (Cardano-related tool)
- **COMP**: (Cardano-related tool)  
- **Futura**: (Cardano-related tool)

## Development Commands

### Installation

```bash
# Install dependencies using bun (preferred for speed)
bun install

# Alternative: use yarn if bun is not available
yarn
```

### Development Server

```bash
# Start local development server
bun start

# For CSS changes (tailwind)
bun watch:css
```

### Build and Deployment

```bash
# Build the CSS files
bun build:css

# Build the static site
bun build

# Serve the built website locally
bun serve

# Deploy to GitHub Pages
GIT_USER=<Your GitHub username> bun deploy
# Or with SSH
USE_SSH=true bun deploy
```

### Type Checking

```bash
# Run TypeScript type checking
bun typecheck
```

## Architecture

### Project Structure

- `/docs/`: Documentation content organized by product
  - `/chrysalis/`: Documentation for Chrysalis (.NET building blocks for Cardano)
  - `/argus/`: Documentation for Argus (.NET indexing framework)
  - etc.

- `/src/`: React components and frontend code
  - `/components/`: UI components 
  - `/pages/`: Main page definitions
  - `/theme/`: Docusaurus theme customizations
  - `/styles/`: CSS and styling

- `/static/`: Static assets like images and icons

### Key Configuration Files

- `docusaurus.config.ts`: Main configuration for the Docusaurus site
- `sidebars.ts`: Sidebar configuration for documentation sections
- `tailwind/app.css`: Tailwind CSS source

### Frontend Architecture

The homepage is built with multiple section components (Section1 through Section8) that are rendered in sequence. The theme uses a combination of Material UI components and custom styling with Tailwind CSS.

The documentation pages use Docusaurus's MDX capabilities with automatic sidebar generation based on the directory structure.

## Workflow Notes

1. Documentation content is written in Markdown in the `/docs` directory
2. Styling uses Tailwind CSS with a build process (`build:css`)
3. React components in `/src` provide custom UI elements
4. The site uses Docusaurus's theme customization for branding consistency

When adding new documentation:
1. Place content in the appropriate product subdirectory in `/docs`
2. Ensure proper frontmatter with title and sidebar_position
3. Images and other assets should be placed in `/static`
# GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Make sure your repository has GitHub Pages enabled

## How It Works

The workflow performs the following steps:

1. Checks out the repository code
2. Sets up Bun runtime
3. Installs project dependencies with `bun install`
4. Builds CSS with `bun run build:css`
5. Builds the Docusaurus site with `bun run build`
6. Deploys the built site to GitHub Pages

## Triggering a Deployment

The deployment workflow will be triggered automatically when:
- You push changes to the `main` branch
- You manually trigger the workflow from the Actions tab

## Troubleshooting

If you encounter any issues with the deployment:

1. Check the workflow run logs in the Actions tab
2. Ensure your `docusaurus.config.ts` has the correct organization and project name
3. Make sure GitHub Pages is properly configured in your repository settings

## Local Testing Before Deployment

You can test your changes locally before pushing to GitHub:

```bash
bun install
bun run build:css
bun run build
bun run serve
```

This will build the site and serve it locally at http://localhost:3000.
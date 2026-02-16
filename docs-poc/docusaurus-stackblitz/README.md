# Docusaurus + StackBlitz PoC

This folder contains a standalone proof of concept for an interactive docs site using Docusaurus
with embedded StackBlitz projects.

## Run locally

```bash
cd docs-poc/docusaurus-stackblitz
npm install
npm run start
```

Open http://localhost:3000 and navigate to:

- `/docs/evo-sdk-read-only-example`

## What this PoC demonstrates

- Docusaurus as the docs framework.
- StackBlitz embedded as a click-to-run IDE.
- A pattern for starting with read-only Evo-SDK tutorials and later extending to credentialed flows.

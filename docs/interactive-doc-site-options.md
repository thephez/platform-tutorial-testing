# Options for turning tutorials/how-tos into an interactive documentation site

## Scope and constraints

This evaluation focuses on the current **Evo-SDK tutorials** in this repository (`tutorials/**/*.mjs`) and excludes the deprecated `js-dash-sdk` content.

Constraints from the request:

- Must be **off-the-shelf software** (no custom-built platform).
- Must be **freely available**.
- Should support **interactive, click-to-run** experiences.

## What matters for this repo

The current tutorials are Node-based `.mjs` scripts and include both:

- **Read-only scripts** (safe to run without secrets).
- **Read-write scripts** (need environment variables / credentials).

A good docs platform should therefore support:

1. Markdown-first tutorial docs.
2. Runnable code blocks or one-click run links.
3. A practical path for handling environment variables for write operations.
4. Low maintenance and no bespoke runtime to build.
5. Responsive UX for interactive examples.

## Best options (ranked)

### 1) Docusaurus + Sandpack (CodeSandbox)

**Why it is now the top choice**

- Docusaurus is a mature, open-source docs framework.
- Sandpack provides a lightweight, in-page runnable code experience.
- Faster perceived interaction than full embedded cloud IDE frames.
- Keeps tutorial pages focused on learning flow, not IDE chrome.

**How it fits Evo-SDK tutorials**

- Use Sandpack for read-only, concept-focused runnable snippets.
- Keep a close mapping between each snippet and the equivalent `.mjs` tutorial.
- Add optional links to full runtime environments (Codespaces) for credentialed or full-file workflows.

**Pros**

- Responsive UX.
- Fully off-the-shelf and free/open tooling.
- Clean docs-first authoring model.

**Risks / limits**

- Sandpack is best for bounded examples, not full repo execution.
- Full Node/runtime parity still needs external environment links.

---

### 2) Docusaurus + StackBlitz embeds

**Why it is still viable**

- Strong one-click “real project” experience.
- Useful when users need a full IDE and project context in browser.

**Pros**

- Full-featured editing/running experience in-browser.

**Risks / limits**

- Can feel heavy/less responsive for embedded docs use.
- More UI weight than needed for simple tutorial steps.

---

### 3) Docusaurus or MkDocs + GitHub Codespaces links

**Why it is important as a companion**

- Provides full runtime parity for credentialed and advanced tutorials.
- Excellent fallback when in-page runners are insufficient.

**Pros**

- Closest to real Node runtime and repo behavior.

**Risks / limits**

- Not as immediate as in-page run buttons.
- Free tier quotas apply.

## Recommendation

### Recommended primary stack

**Docusaurus + Sandpack**, with **Codespaces links** for full-runtime/credentialed tutorials.

Why this is the best balance now:

- Best responsiveness for docs-first tutorial consumption.
- Meets interactive click-to-run requirements for read-only examples.
- Keeps implementation off-the-shelf and low maintenance.

## Suggested rollout

1. Stand up Docusaurus sections mirroring tutorial folders.
2. Publish 5–10 read-only Evo-SDK tutorials first as lightweight runnable pages.
3. For each write tutorial, add credential setup steps and an "Open in Codespaces" fallback link.
4. Keep deprecated `js-dash-sdk` out of the initial interactive docs surface.

## Shortlist summary

- **Best overall now:** Docusaurus + Sandpack (+ Codespaces fallback).
- **Best full browser IDE option:** Docusaurus + StackBlitz.
- **Best runtime parity / credentialed workflows:** Docs + Codespaces.

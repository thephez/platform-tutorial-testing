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

## Best options (ranked)

### 1) Docusaurus + embedded StackBlitz (WebContainers) projects

**Why it is a top choice**

- Docusaurus is a mature, open-source docs site framework.
- StackBlitz embeds provide true click-to-run Node examples in-browser.
- Strong authoring UX for tutorials/how-tos with versioning and search.
- Easy to mix static explanation + live runnable examples.

**How it fits Evo-SDK tutorials**

- Convert each tutorial into a docs page with:
  - explanation,
  - code snippet,
  - embedded StackBlitz project or “Open in StackBlitz” button.
- Start with read-only tutorials first.
- Mark write tutorials as “requires credentials”; run them in user-owned environment (StackBlitz session or local clone).

**Pros**

- Very strong docs UX.
- Minimal infrastructure overhead.
- Fully off-the-shelf components.

**Risks / limits**

- Some Node/native package combinations can be limited in browser sandboxes.
- Secret management for write tutorials should stay user-supplied.

---

### 2) MkDocs Material + Jupyter notebooks + Binder

**Why it is strong**

- MkDocs Material is open source and excellent for technical docs.
- Binder gives one-click cloud execution with zero local setup.
- Good fit when you want “run this tutorial now” from docs.

**How it fits Evo-SDK tutorials**

- Port key tutorial scripts into JavaScript or Python-compatible notebook workflows.
- Add “Launch Binder” buttons per tutorial.
- Keep write tutorials gated with explicit credential steps.

**Pros**

- Fully open-source stack.
- Real server-side execution environment (fewer browser runtime constraints).

**Risks / limits**

- Requires notebook-centric authoring model.
- Binder cold starts can be slow.
- More adaptation effort if your source of truth is `.mjs` scripts.

---

### 3) Docusaurus or MkDocs + GitHub Codespaces “Open in Codespaces” flows

**Why it is viable**

- Keeps docs static and simple while making execution one-click in a real dev environment.
- No need to force all scripts into browser runtimes.
- Excellent for read-write tutorials needing env vars and CLI access.

**How it fits Evo-SDK tutorials**

- Add per-tutorial “Run in Codespaces” links to preconfigured folders/scripts.
- Provide `.env.example`-driven setup in the repo.

**Pros**

- Closest to real Node runtime.
- Great for advanced and credentialed tutorials.

**Risks / limits**

- Not as instant as an in-page live code block.
- Codespaces free usage quotas apply.

## Recommendation

### Recommended primary stack

**Docusaurus + StackBlitz embeds**, with a **Codespaces fallback path** for tutorials that cannot reliably run in browser sandboxes or need sensitive credentials.

Why this is the best balance now:

- Best tutorial reading experience + fast interactivity.
- Works well for the repo’s current `.mjs` tutorial style.
- Lets you phase migration quickly by prioritizing read-only Evo-SDK tutorials first.
- Stays inside “off-the-shelf” and free/open tooling.

## Suggested rollout

1. Stand up Docusaurus with sections that mirror existing tutorial folders.
2. Migrate 5–10 read-only Evo-SDK tutorials first and embed runnable projects.
3. Add a standard “credentials required” pattern for write tutorials.
4. Add “Run in Codespaces” buttons for tutorials requiring full Node/runtime parity.
5. Keep deprecated `js-dash-sdk` out of the initial interactive surface.

## Shortlist summary

- **Best overall:** Docusaurus + StackBlitz (+ Codespaces fallback).
- **Best fully OSS execution model:** MkDocs Material + Binder.
- **Best for runtime parity / credentialed tasks:** Docs + Codespaces.

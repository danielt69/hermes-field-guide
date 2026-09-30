# Hermes Field Guide · J.A.R.V.I.S. Edition

One practical guide combining **hermes-field-guide** and **hermes-for-daniel**. The earlier guides had identical visible learning content; both histories are retained in this repository. Original HTML snapshots live in `archive/`.

**Live:** https://danielt69.github.io/hermes-field-guide/

## What is inside

- Fourteen source-checked chapters: the harness, tools, skills, memory, profiles, models, MCP, workflows, automation, local workbench, learning path, and command reference.
- **Build your J.A.R.V.I.S.:** identity, memory layers, retrieval, permissions, voice, wake word, gateway, scheduling, goals, recovery and backups.
- **Build your startup team:** a small pilot followed by a full specialist team, shared versioned context, dependency-gated tasks, isolated worktrees, handoffs, evidence and reporting to JARVIS.
- Twelve downloadable starter templates in `public/templates/`.
- JARVIS-inspired midnight/cyan design, HeroUI v3 controls and HeroUI Pro Command/Sheet, light theme, full-content keyboard search, local reading progress, compact mode and mobile navigation.

This is a **static learning resource**, not a live control plane. It connects to no agent, account or telemetry feed. Setup recipes distinguish native capabilities, integrations and recommended architecture. Profiles do not automatically share memory.

## Source snapshot

Reviewed **30 September 2026**, against official Hermes documentation and source commit `f42f579cf8bac4918ac9599bece71618afadd846`. See `docs/content-audit.md`, `docs/advanced-verification.md`, and each chapter's citations. Syntax and source were checked; no production agent team, voice integration or user automation was deployed by writing this guide.

## Local development

Requires Node 24+ and a valid **HeroUI Pro** entitlement. The Pro package is not redistributed as source here. Complete the official HeroUI Pro login flow for your account before installing its licensed implementation:

```bash
npm ci
npx heroui-pro login
npx heroui-pro install --yes
npm run dev
```

Open the Vite URL with `/hermes-field-guide/`. Unlike the archived single-file guide, this version requires a build/server; do not open root `index.html` using `file://`.

```bash
npm test                 # unit and React regression tests
npm run validate:content # sources, catalogue, routes, headings, template links
npm run build            # TypeScript + production Vite build
npm run preview          # serve the built result
```

With the dev server running at port 5178:

```bash
npm run dev -- --port 5178
# in another terminal; installed Google Chrome is used by default
npm run test:e2e
```

Set `BASE_URL` to test another server or the deployed site. Set `CHROME_BIN` for an explicit Chromium executable. Browser tests cover all chapters at seven widths in both themes, axe checks, keyboard search, deep links, copy, progress, preferences, mobile sheets and reduced motion. Generated screenshots/reports stay in ignored `verification/`.

## Publishing

Source is maintained on `main`; built assets are deployed on `gh-pages`. GitHub Pages serves that branch. Licensed dependencies are built locally—no personal HeroUI credentials are uploaded to GitHub. The lightweight GitHub workflow checks content; local build and browser gates are documented separately, not represented as CI checks.

After verifying and pushing the source commit:

```bash
npm run publish:pages
```

The publisher refuses dirty or unpushed source, re-runs tests/content/build, creates a temporary checkout of the deployment branch, writes `build-info.json` with the source SHA, and pushes without force. It does not merge source branches. Wait for the corresponding Pages deployment and test the live URL before declaring publication complete.

## Maintenance

Edit `content/*.md`; chapter metadata/order lives in `src/data/chapters.json`. Keep JARVIS and Startup Team last. Update the source commit and research date together. Check links and local CLI help again after Hermes updates. Never add invented live status or model/skill counts.

The design takes inspiration from https://github.com/danielt69/jarvis-hud. Hermes Agent is by Nous Research; this guide is independent. HeroUI Pro remains subject to its own license.

# UI and build verification

Verified locally on 30 September 2026 in installed Google Chrome through Playwright. See `scripts/verify-ui.mjs` for reproducible assertions, not simulated screenshots.

- `npm test`: 6 tests in 4 files, passing. Includes strict-mode Markdown anchor regression.
- `npm run validate:content`: 14 chapters, 110 unique-per-chapter headings, 57 official source URLs, 12 templates, 13 template links, 22 internal links.
- `npm run build`: TypeScript and production Vite build pass. Vite reports a non-fatal >500 kB JavaScript chunk advisory; the compressed application bundle is about 227 kB.
- `npm run test:e2e`: 196 layout cases (14 chapters × 7 widths × 2 themes), no document-level horizontal overflow.
- Widths: 320, 375, 390, 768, 1024, 1280, 1440 pixels.
- 9 axe scans with WCAG 2 A/AA and 2.1 AA tags: zero violations in the tested views (three key chapters in each theme, preferences, populated search, empty search). This is automated coverage, not a claim of complete accessibility certification.
- Keyboard full-body search; empty state; modal dismissal; copy to real clipboard; progress reload; heading deep links; mobile chapter sheet; theme and density reload; confirmed reset; legacy routes; reduced-motion preference.
- Zero browser console errors, uncaught page errors, or failed HTTP resources in the tested route.
- Screenshots visually inspected: desktop dark, desktop light, mobile JARVIS tutorial.
- `npm audit --omit=dev`: zero vulnerabilities reported.
- Publisher refusal tested: dirty source correctly blocks publication before any external write.

## Fixed during verification

- Replaced mutable Markdown render counters with stable source-line mapping; React StrictMode no longer skips heading IDs.
- Memoized the article so scroll-progress updates do not remount copy buttons and erase feedback.
- Corrected an oversized decorative pseudo-element at 1024px rather than hiding page overflow.
- Made the command-results scroller keyboard focusable without modifying React Aria's virtual-focus menu internals.
- Keep light/dark CSS classes mutually exclusive.

Generated reports/screenshots live in ignored `verification/`. Production publication must additionally check the Pages deployment commit and fetch `build-info.json`, then repeat browser verification against the public URL. This document does not claim that any Hermes profile, agent team, gateway, cron job, voice provider, or live integration was installed or exercised.

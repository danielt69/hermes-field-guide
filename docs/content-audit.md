# Content audit: merging the Hermes guides

- **Date:** 30 September 2026
- **Upstream docs snapshot:** `f42f579cf8bac4918ac9599bece71618afadd846`
- **Scope:** `content/01-overview.md` through `content/12-sources.md`. The parent owns the two advanced chapters, `#/jarvis` and `#/startup-team`.

## 1. Original inputs

| Repo | Public URL | Finding |
|---|---|---|
| hermes-field-guide | https://github.com/danielt69/hermes-field-guide | Single `index.html` |
| hermes-for-daniel | https://github.com/danielt69/hermes-for-daniel | Single `index.html` |

The two files differ at the byte level (47,254 vs 42,725 bytes) in markup, styles and scripts only. Their visible text was extracted and compared with Python's `difflib`. Both are 230 non-empty lines with a similarity ratio of 1.0, and both use the same section IDs. The merge therefore preserves a single content set, and no learning theme was lost from either file.

## 2. Mapping from original section IDs to new chapters

| Original ID | Original title | New chapter(s) | Coverage notes |
|---|---|---|---|
| `overview` | The system in six pieces | `#/overview` | Six layers expanded to seven by adding the Desktop, TUI and dashboard surfaces. The distinction between tools, skills and memory is kept. |
| `first-session` (+ `baseline`, `chat`, `control`, `memory`) | Your first 30 minutes | `#/first-session`, `#/memory-context` | Baseline, read-only task (now `--oneshot`), session controls (plus `/steer`, `/queue`) and the durable preference, with the frozen-snapshot caveat added. |
| `tools` (+ `daily`, `builder`, `creative`) | The capability map | `#/tools-skills`, `#/workflows`, `#/mcp-plugins`, `#/local-workbench` | Tool categories kept. Skill list corrected (`plan` is now `/plan`; `github-pr-workflow` is now `github`). `excalidraw` marked optional. |
| `add-next` | The best additions for your setup | `#/learning-path` (Add next), `#/profiles-models`, `#/mcp-plugins`, `#/local-workbench` | Now / Next / Later order preserved. Per-item minute estimates removed as unverifiable. "Avoid for now" preserved. |
| `working` | How to work with Hermes well | `#/workflows` | All six patterns kept (inspect, plan, execute, delegate, research, automate last). Added `/plan`, `/review`, `/goal` and the choice between ephemeral and durable work. |
| `settings` | A sane Mac-first baseline | `#/profiles-models`, `#/first-session`, `#/local-workbench` | Defaults corrected: `approvals.mode` already defaults to `smart`, `redact_secrets` is already on, and checkpoints are opt-in. |
| `mac` | Use the M5 Max deliberately | `#/local-workbench` | Lanes kept. Hardware specs and the fixed concurrency advice ("three subagents") removed. |
| `recipes` | Four workflows worth keeping | `#/workflows` | All four recipes kept (discovery, frontend delivery, agentic review, research briefing). |
| `roadmap` | A seven-day learning path | `#/learning-path` | Same seven themes, each with a concrete success check. |
| `sources` | Sources and live references | `#/sources`, plus a per-chapter `### Sources` section | All 9 official links carried forward and the register expanded. The personal resume link is not reused as a technical source. |

## 3. Stale or unverifiable content removed

- The "researched 11 July 2026" banner, replaced by the dated snapshot and the pinned commit.
- Live telemetry: `gpt-5.6-sol · OpenAI Codex`, `M5 Max · 18 cores`, `128 GB unified memory`, `Telegram gateway live`, `72 skills enabled`.
- Time estimates per addition (10 min, 1–2 hr and so on).
- "Three independent subagents is a strong default". The current docs give conflicting defaults for concurrency (3 in configuration.md, 10 in delegation.md), so the guide states no number.
- The claim that local faster-whisper "your M5 Max can run comfortably", which is a hardware performance claim.
- The progress and "Onboarding 0%" UI state. That belongs to the parent UI, not to the content.

## 4. Corrections and additions

- `hermes chat -q` alone now seeds an interactive session on a TTY. Use `--oneshot` for non-interactive runs.
- Context precedence is `.hermes.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`, with the first match winning. `SOUL.md` loads only from `HERMES_HOME`.
- New coverage relative to the July guide: Desktop, TUI, dashboard, Kanban and worker lanes, goals and gates, memory providers, the MCP catalog and serve, the skills lifecycle (trust levels, write approval, curator, journey), `hermes pause`, and cron canaries.
- Voice now separates network services from local ones: Edge TTS is a network service; faster-whisper is local after its model downloads. The Ava preference is kept as an example with an unverified voice ID.
- Every chapter now labels content as native, optional provider or design pattern.

## 5. Known uncertainties

- The exact Edge "Ava Multilingual" voice ID was not verified. The chapter uses a placeholder.
- The delegation concurrency default conflicts between docs pages. The guide avoids stating it.
- `hermes verify` and `hermes sync` appear in the local `--help` output but not in the docs. They are omitted from the chapters.
- The skill availability described reflects the docs catalog at the pinned commit. A given install may differ.

## 6. Automated checks

Generated by a Python script (`audit_check.py`, kept in scratch) on 30 September 2026. The numbers below were computed by the script, not counted by hand.

| File | Words | Unique doc URLs | Sources-section URLs | Code fences | Untagged fences | H1 | Frontmatter | Raw HTML | Has Sources |
|---|---|---|---|---|---|---|---|---|---|
| 01-overview.md | 579 | 12 | 11 | 0 | 0 | False | False | False | True |
| 02-first-session.md | 504 | 7 | 7 | 3 | 0 | False | False | False | True |
| 03-tools-skills.md | 492 | 7 | 7 | 4 | 0 | False | False | False | True |
| 04-memory-context.md | 524 | 5 | 5 | 2 | 0 | False | False | False | True |
| 05-profiles-models.md | 456 | 9 | 7 | 3 | 0 | False | False | False | True |
| 06-mcp-plugins.md | 467 | 7 | 7 | 3 | 0 | False | False | False | True |
| 07-workflows.md | 502 | 6 | 6 | 1 | 0 | False | False | False | True |
| 08-automation.md | 436 | 9 | 9 | 1 | 0 | False | False | False | True |
| 09-local-workbench.md | 488 | 8 | 8 | 2 | 0 | False | False | False | True |
| 10-learning-path.md | 472 | 7 | 7 | 0 | 0 | False | False | False | True |
| 11-command-reference.md | 443 | 6 | 6 | 2 | 0 | False | False | False | True |
| 12-sources.md | 368 | 26 | 3 | 0 | 0 | False | False | False | True |

- Unique official doc URLs across chapters: **52**
- URLs without a matching file in the pinned `website/docs` tree: **0**
- URLs not returning HTTP 200 from the live site (curl -L): **0**
- Internal links used: `#/automation`×1, `#/command-reference`×1, `#/first-session`×2, `#/jarvis`×3, `#/local-workbench`×2, `#/mcp-plugins`×1, `#/memory-context`×3, `#/overview`×1, `#/profiles-models`×2, `#/startup-team`×4, `#/workflows`×1
- Unknown internal link targets: **0**
- Chapters failing structural rules (H1, frontmatter, raw HTML, untagged fence, missing Sources): **0**

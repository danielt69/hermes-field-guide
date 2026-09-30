This chapter turns a stock Hermes install into a dedicated personal assistant profile called `jarvis`. It gets its own identity, curated memory, a small set of tools that need approval, voice, access from your phone, scheduled briefs and a way to recover. Every command below was checked against `hermes <subcommand> --help` on Hermes v0.21.5 (upstream `f42f579`) and against the official docs. Each step is marked as either **official capability** (Hermes does this) or **recommendation** (how this guide suggests wiring it together).

Be clear about what you are building. It is a well-configured agent that runs when you start it, or when the gateway, cron or a webhook wakes it. It is not sentient. It does not listen all the time unless you turn on the wake word. It can only reach the files, tools and accounts you connect to it.

## Capability matrix

| Capability | How you get it | Type |
|---|---|---|
| Stable identity and rules | `SOUL.md` in the profile home | Native configuration |
| Curated long-term notes | `MEMORY.md` / `USER.md` via the `memory` tool | Native |
| Recall of old conversations | `session_search` over the profile's `state.db` | Native |
| Semantic or graph memory | External memory provider (Honcho, Mem0, Supermemory…) | Integration (third party or self-hosted) |
| Project knowledge | Your own files plus `AGENTS.md`, skills such as `llm-wiki` | Native, fed with your content |
| Local tools (files, shell, web, browser) | Toolsets plus approvals | Native |
| GitHub, calendar, SaaS apps | MCP servers you add, one at a time | Integration |
| Push-to-talk voice | `/voice` (local Whisper STT, TTS provider of your choice) | Native, needs audio dependencies |
| Wake word | `/wake` (off by default) | Native engines; the Porcupine "jarvis" keyword needs a Picovoice key |
| Phone access | Gateway platforms such as Telegram | Integration (bot token plus allowlist) |
| Scheduled briefs | `hermes cron` | Native |
| Event triggers | Webhook routes | Native receiver, external sender |
| Long multi-turn jobs | `/goal` with gates | Native |
| Specialist team | Kanban board plus profiles (next chapter) | Native primitives, your recipe |
| Continuous ambient listening, camera awareness, "just knows" your inbox | Not provided | Custom build |

Hermes never gets automatic access to an integration. If you did not connect it, JARVIS cannot see it.

## Phase 0 — Prerequisites

1. A working Hermes install. Run `hermes --version` and `hermes doctor`.
2. A model provider account you are willing to pay for.
3. Read [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security) once, especially the sections on approvals and the gateway allowlist.
4. For voice on macOS: `brew install portaudio ffmpeg`. [Voice mode](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode) lists the other platforms.

## Phase 1 — A dedicated profile

A profile is a separate Hermes home with its own config, `.env`, `SOUL.md`, memory, sessions, skills and cron jobs ([Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)).

```bash
hermes profile create jarvis --description "Personal chief of staff: plans, researches, schedules, and orchestrates the specialist team."
hermes -p jarvis setup
hermes profile show jarvis
```

The `--clone` flag copies `config.yaml`, `.env`, `SOUL.md`, skills **and** the curated `MEMORY.md`/`USER.md`. Leave it off if you want JARVIS to start without your existing notes.

A profile is **not a sandbox**. On the local backend the agent has your user's file access. Give it a fixed working directory:

```bash
hermes -p jarvis config set terminal.cwd /ABSOLUTE/PATH/jarvis-workspace
```

## Phase 2 — Identity and policy (`SOUL.md`)

Download [`SOUL.jarvis.md`](templates/SOUL.jarvis.md), replace every `<PLACEHOLDER>`, then install it explicitly:

```bash
cp ~/Downloads/SOUL.jarvis.md ~/.hermes/profiles/jarvis/SOUL.md
```

Hermes loads `SOUL.md` only from the profile home and scans it for prompt injection. A new session picks up edits ([Personality](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality)). The template's rules include:

- confirm before spending, publishing or sending anything
- cite evidence
- never claim a memory was saved unless the tool call succeeded

These rules are **policy the model reads, not enforcement**. Enforcement comes from toolsets, approvals, deny rules and the terminal backend.

## Phase 3 — Model routing and cost

```bash
hermes -p jarvis model            # pick provider + main model interactively
hermes -p jarvis fallback add     # append a fallback provider:model
hermes -p jarvis fallback list
```

Recommendation: use a strong main model for JARVIS, since it plans and orchestrates. Route cheap auxiliary tasks elsewhere. [`jarvis-profile.overlay.yaml`](templates/jarvis-profile.overlay.yaml) shows the keys `auxiliary.goal_judge` and `auxiliary.background_review` with placeholder models. It is an **overlay**: merge the keys you want with `hermes -p jarvis config edit`, not as a replacement for the whole file.

Watch spending with these commands:

```bash
hermes -p jarvis insights --days 7
hermes -p jarvis usage
```

For long one-off runs, `hermes -p jarvis chat --run-budget 1800 --max-turns 60` caps both wall-clock time and the number of tool iterations.

## Phase 4 — Memory, retrieval and knowledge

These are the storage layers, per [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) and [Memory providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers):

| Layer | Where | Limits |
|---|---|---|
| `MEMORY.md` (agent notes) | `~/.hermes/profiles/jarvis/memories/` | 2,200 chars. Frozen into the prompt at session start; new entries appear next session |
| `USER.md` (about you) | same folder | 1,375 chars |
| Session search | the profile's `state.db` (SQLite FTS5) | Searches past sessions on demand; not prompt-resident |
| External provider | the provider's cloud or your server | Only one active per profile. Turns are synced to that provider, which is a third-party data flow |

Memory is scoped per profile. Two profiles never share `MEMORY.md`. Do not symlink it, `state.db` or `auth.json` between profiles. Turn on reviewed writes:

```bash
hermes -p jarvis config set memory.write_approval true
hermes -p jarvis memory status
cat ~/.hermes/profiles/jarvis/memories/MEMORY.md
```

With the gate on, anything written outside the interactive CLI (gateway, background review) is staged. Review it in chat with `/memory pending`, `/memory approve <id>` and `/memory reject <id>`. Prune what JARVIS has learned with `hermes -p jarvis journey list`, `journey edit <node>` and `journey delete <node>`.

Put knowledge in files, not memory. Recommendation: keep a versioned notes folder or wiki under the workspace. Load the bundled `llm-wiki` skill when maintaining it (`hermes -p jarvis chat -s llm-wiki`). Add an external provider with `hermes -p jarvis memory setup` only after reading its data-storage row in the providers doc. Follow [`MEMORY-POLICY.md`](templates/MEMORY-POLICY.md).

## Phase 5 — Tools, skills, MCP and permissions

```bash
hermes -p jarvis tools list
hermes -p jarvis tools disable computer_use image_gen
hermes -p jarvis config set approvals.mode manual
hermes -p jarvis config set skills.write_approval true
hermes -p jarvis approvals test -- git push --force origin main
```

`approvals test` evaluates a command against the real guards without running it. Add hard stops under `approvals.deny`; the overlay has examples. Deny rules apply even in YOLO mode. Do **not** set `approvals.mode: off` or run with `--yolo` as a default ([Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)).

Add integrations one at a time. Start with the documented DeepWiki catalog entry for public repository research; it does not grant access to your private GitHub account:

```bash
hermes -p jarvis mcp install deepwiki
hermes -p jarvis mcp configure deepwiki
hermes -p jarvis mcp test deepwiki
```

Review the catalog manifest before installation. Use the configuration checklist to enable only the tools you need, then start a new session. For private accounts, follow the server's official authentication flow and scope its credentials narrowly; do not paste tokens into shell command arguments or chat. `tools.include` under `mcp_servers.<name>` restricts exposed MCP tools ([MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)). This is not a substitute for provider-side permissions.

## Phase 6 — Voice

- **Push-to-talk (native):** run `hermes -p jarvis`, then `/voice on`, and press Ctrl+B to record. `/voice tts` toggles spoken replies. macOS will ask for microphone permission for your terminal app.
- **STT:** `stt.provider: local` (faster-whisper) downloads a model once from Hugging Face, then transcribes on-device. Groq, OpenAI and Mistral STT send your audio to those companies.
- **TTS:** the default `edge` provider needs no key, but it sends reply **text** to Microsoft's online Edge speech service. For fully local speech use `piper`, `kittentts` or `neutts`:

```bash
hermes -p jarvis config set tts.provider piper
hermes -p jarvis tools post-setup piper
```

- **Wake word (native, off by default):** detection runs on-device and only while a Hermes CLI, TUI or desktop surface is running. The free `sherpa` engine accepts any phrase:

```bash
hermes -p jarvis config set wake_word.provider sherpa
hermes -p jarvis config set wake_word.phrase "hey jarvis"
```

Then run `/wake on` inside `hermes -p jarvis`. Porcupine's built-in `jarvis` keyword is an alternative, but it needs `PORCUPINE_ACCESS_KEY` in the profile `.env` ([Wake word](https://hermes-agent.nousresearch.com/docs/user-guide/features/wake-word)). A streaming, always-on bridge from another device (a phone or smart speaker) would be your own custom integration.

## Phase 7 — Reach: gateway, cron and events

One **host gateway** (started from the default profile) serves every profile. A named profile refuses `gateway start` unless you pass `--force` ([Multi-profile gateways](https://hermes-agent.nousresearch.com/docs/user-guide/multi-profile-gateways)). Put JARVIS's own bot token and allowlist in the jarvis profile:

```bash
hermes -p jarvis gateway setup
hermes gateway install
hermes gateway status
```

Never set `GATEWAY_ALLOW_ALL_USERS`. Use `TELEGRAM_ALLOWED_USERS=<YOUR_ID>` or DM pairing.

Scheduled brief, created paused so you review it first:

```bash
hermes -p jarvis cron create "0 8 * * 1-5" "Morning brief: today's calendar items I shared, open board cards, and blockers needing my decision. Under 200 words." --name morning-brief --deliver telegram --paused --paused-reason "review prompt first"
hermes -p jarvis cron list --all
hermes -p jarvis cron resume <JOB_ID>
```

Cron runs deny dangerous commands by default (`approvals.cron_mode: deny`). For event triggers, enable the webhook platform, then bind a route to jarvis:

```bash
hermes webhook subscribe new-issue --route-profile jarvis --events issues --prompt "Triage GitHub issue: {issue.title}" --deliver telegram
```

Webhook runs use the restricted `hermes-webhook` toolset: web and vision only, with no terminal or file access ([Webhooks](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks)).

## Phase 8 — Goals and observability

Use `/goal` for work that should continue across turns. Give it a contract and a deterministic gate:

```text
/goal Produce a vendor comparison for <TOPIC> in notes/vendors.md
verify: file exists with a sources section
stop when: a purchase or signup is required
/goal gate add test -s notes/vendors.md
```

A goal lives in one session and never creates board cards ([Goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals)). On gateways, start a new session with `/new` at natural boundaries so memory refreshes. To see what is happening:

```bash
hermes logs gateway -f
hermes -p jarvis sessions list --limit 10
hermes -p jarvis cron runs --limit 20
hermes status
```

## Phase 9 — Approval gates and emergency stop

These actions always need your explicit yes: payments, public posts, emails to third parties, deleting data, pushing to a shared branch, and granting new credentials. Enforce what you can with `approvals.deny`, disabled toolsets, and a container or SSH terminal backend for anything that faces the internet. Emergency stop:

```bash
hermes pause --reason "investigating unexpected activity"
hermes resume
```

`pause` stops **new** cron runs, kanban dispatch and gateway turns. It does not kill work already in flight.

## Phase 10 — Backups

```bash
hermes backup -o /ABSOLUTE/PATH/backups/hermes-full.zip
hermes profile export jarvis -o /ABSOLUTE/PATH/backups/jarvis.tar.gz
```

Full backups contain secrets and `state.db`, so store them encrypted. Profile exports strip API keys. To practise a restore without touching the live profile, run `hermes profile import /ABSOLUTE/PATH/backups/jarvis.tar.gz --name jarvis-restore-test`.

## Readiness drills

| Drill | Do | Pass only with evidence |
|---|---|---|
| Memory | Ask it to save one fact, then run `/memory pending` and approve | The line appears in `MEMORY.md` via `cat` |
| Approval | `hermes -p jarvis approvals test -- rm -rf ./build` | Verdict is ask or deny, not allow |
| Identity | Start a new session and ask for its rules | Rules match your `SOUL.md` |
| Voice | `/voice on`, speak, hear a reply | A transcript appears; audio plays |
| Cron canary | Resume the paused job, then run `hermes -p jarvis cron run <JOB_ID>` | A delivery shows up in `cron runs` and on your phone |
| Kill switch | `hermes pause`, send a chat message, then `hermes resume` | No new turn while paused |
| Restore | Import the export under a test name | `hermes profile show jarvis-restore-test` works |

## Recovery

| Symptom | Check | Fix |
|---|---|---|
| "I'll remember" but it doesn't | `cat` `MEMORY.md`, `/memory pending` | Approve the write, or tell it to call the memory tool explicitly |
| Bot silent | `hermes gateway status`, `hermes logs gateway -n 100` | Fix the allowlist or token in the jarvis `.env`; reinstall the host gateway |
| Wrong personality | `ls ~/.hermes/profiles/jarvis/SOUL.md` | Start a new session; confirm you ran with `-p jarvis` |
| Runaway cost | `hermes -p jarvis insights --days 1` | `hermes pause`; route auxiliary tasks to a cheaper model |
| Broken config | `hermes -p jarvis config check` | Restore from the export |

Next: give JARVIS a team of specialists in [Startup team](#/startup-team).

### Sources

- https://hermes-agent.nousresearch.com/docs/user-guide/profiles
- https://hermes-agent.nousresearch.com/docs/user-guide/features/personality
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers
- https://hermes-agent.nousresearch.com/docs/user-guide/security
- https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
- https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode
- https://hermes-agent.nousresearch.com/docs/user-guide/features/wake-word
- https://hermes-agent.nousresearch.com/docs/user-guide/features/tts
- https://hermes-agent.nousresearch.com/docs/user-guide/multi-profile-gateways
- https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
- https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks
- https://hermes-agent.nousresearch.com/docs/user-guide/features/goals
- https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers
- CLI help captured from Hermes v0.21.5 (upstream f42f579), see docs/advanced-verification.md

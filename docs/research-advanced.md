## Research notes: advanced chapters (JARVIS, startup team)

These notes are source-grounded facts behind chapters 13 and 14, from upstream `f42f579` (docs in `website/docs`, CLI in `hermes_cli`). Paths are relative to https://hermes-agent.nousresearch.com/docs/.

### Profiles — user-guide/profiles, user-guide/multi-profile-gateways
- A profile is a separate `HERMES_HOME` with its own config, `.env`, SOUL, memory, sessions, skills and cron. It is not a sandbox; use `terminal.cwd`, `HERMES_WRITE_SAFE_ROOT` or a container backend for that.
- `--clone` copies config, `.env`, SOUL, skills and `MEMORY.md`/`USER.md`. `--clone-all` copies everything except history. Messaging channels are never cloned unless you pass `--clone-channels`.
- Never point two agent processes at one profile.
- One host gateway multiplexes every profile by default. `gateway install`/`start` on a named profile exits 78 unless you pass `--force` or set `gateway.standalone: true`.

### Memory — user-guide/features/memory, memory-providers
- `MEMORY.md` holds 2,200 chars and `USER.md` 1,375, as a frozen snapshot at session start. There is no auto-compaction; writes that exceed the limit error out.
- `memory.write_approval: true` stages writes, which you manage with `/memory pending|approve|reject`. The `journey list/edit/delete` subcommands prune what the agent has learned.
- Only one external provider can be active per profile. Bundled providers: honcho, openviking, mem0, holographic, retaindb, byterover, supermemory. Hindsight comes from the plugin catalog.
- Namespacing: Supermemory `container_tag` supports `{identity}` plus multi-container mode. Honcho gives each profile its own AI peer inside a shared workspace. Neither is automatic shared memory between profiles.

### Kanban — features/kanban, kanban-tutorial, kanban-worker-lanes, kanban-multi-gateway
- A durable SQLite board, shared across profiles. Workers are spawned by a dispatcher that runs inside the gateway; `kanban daemon` is deprecated.
- Parent links gate dependencies: a child moves from `todo` to `ready` once all parents are done. Children also see each parent's handoff `summary` and `metadata` in context.
- Workspaces: `scratch` is deleted on completion unless files are declared as artifacts. `dir:<abs>` and `worktree` are preserved.
- Controls: `--max-runtime`, `--max-retries`, `kanban.failure_limit` (default 2), `max_in_progress`, the respawn guard, and `diagnostics`.
- The orchestrator needs the `kanban` toolset enabled explicitly; the `all` toolset does not include it. `delegate_task` children cannot change the board.
- `auto_decompose` defaults to true: the triage decomposer fans work out automatically. The chapters turn it off.
- Pitfalls: linking a support card under the card it is meant to unblock deadlocks both. Follow-up work belongs in a new child card, not by reopening a done card.

### Goals, delegation, cron, webhooks
- `/goal` is single-session and supports contracts plus `/goal gate add`. It never creates board cards.
- Delegation summaries come from the subagent and are not verified evidence. Children inherit the parent's toolsets.
- Cron: `--paused`, `--deliver`, `--workdir`, `--no-agent --script`. Dangerous commands are denied by default under `approvals.cron_mode: deny`.
- Webhook runs get the restricted `hermes-webhook` toolset. `--route-profile` binds a route to a specific profile.

### Voice — features/voice-mode, wake-word, tts
- `/voice on` with Ctrl+B for push-to-talk. Local faster-whisper STT runs on-device after a one-time model download.
- The default TTS provider is Edge: free and keyless, but online through Microsoft. Piper, KittenTTS and NeuTTS are local.
- The wake word is off by default and detects on-device while a Hermes surface is running. Porcupine's default keyword is "jarvis" and needs `PORCUPINE_ACCESS_KEY`. Sherpa accepts any typed phrase.

### Security — user-guide/security
- Approval modes: `smart` (default), `manual`, `off`. `cron_mode`, `single_query_mode` and `unattended_mode` all default to deny.
- `approvals.deny` is enforced even under YOLO. `hermes approvals test` dry-runs a command against the guards.
- MCP subprocesses receive only a filtered environment.
- `SOUL.md` and `AGENTS.md` are scanned for prompt injection, but they are guidance, not enforcement.
- Gateways deny everyone by default; never use `GATEWAY_ALLOW_ALL_USERS` in production.

### Deliberately not claimed
- Automatic shared memory across profiles, chat between agents, a "startup team" feature, always-on ambient listening, or access to any integration you have not configured.

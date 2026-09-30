## A seven-day learning path

Learn one capability per day. Each day should produce a real result that you can check, not another configuration layer. Progress is measured by what you can demonstrate, not by how many boxes you tick. Take longer on any day if you need to.

### Day 1: Tool fluency

Research something, inspect a repo, edit one file, run its tests, and use `/stop`, `/retry` and `/undo`.
**Success check:** you can point to one file change backed by test output ([First session](#/first-session)).

### Day 2: Project rules

Add or refine `AGENTS.md` in an active repo; `/init` can draft one for you. Then use `/plan` and the `test-driven-development` skill on a small change.
**Success check:** a fresh session in that repo follows your test gate without being reminded ([Memory & context](#/memory-context)).

### Day 3: Profiles

Create separate `coder` and `research` profiles, and set an explicit `terminal.cwd` for `coder`.
**Success check:** `hermes profile list` shows both profiles, and memory saved in one does not appear in the other ([Profiles & models](#/profiles-models)).

### Day 4: MCP

Install one reviewed server, filter it down to the tools you need, and test the read-only path.
**Success check:** `hermes mcp test <name>` passes, and one read-only query returns real data ([MCP & plugins](#/mcp-plugins)).

### Day 5: Delegation

Run a three-way review (security, performance, UX), passing each child its context explicitly.
**Success check:** the synthesis cites each finding as file:line and removes duplicates ([Workflows](#/workflows)).

### Day 6: Remote and voice

Work through Telegram, and generate one spoken brief.
**Success check:** `hermes gateway status` is healthy, and the audio arrives where you expect it ([Local workbench](#/local-workbench)).

### Day 7: Automation

Turn the best manual workflow from this week into a paused cron canary, run it once, and then decide whether to resume it.
**Success check:** `hermes cron runs <id>` shows a completed attempt, and `hermes cron doctor` has no findings ([Automation](#/automation)).

### Add next, in order

Add each layer only when you have seen a problem it solves.

1. **Now:** `AGENTS.md` in active repos, `gh` authentication for the `github` skill (keep writes approval-gated), and the coder/research profiles.
2. **Next:** local STT with your chosen TTS voice, one reviewed MCP server, and one Telegram automation that starts as a one-shot.
3. **Later:** a local model lane benchmarked against your hosted model, a fallback provider and credential pool with explicit model pins for unattended jobs, shell completion (`hermes completion zsh`), and scheduled backups.
4. **Then:** the capstones [Build your J.A.R.V.I.S.](#/jarvis) and [Build a startup team](#/startup-team).

### Avoid for now

- Enabling every MCP server.
- Permanent YOLO mode or `approvals.mode: off`.
- Several overlapping memory providers.
- Recurring jobs whose one-shot behaviour you have not yet checked.

### Sources

- [Learning path (official)](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path)
- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Context files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)
- [Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)
- [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Subagent delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation)
- [Scheduled tasks (cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)

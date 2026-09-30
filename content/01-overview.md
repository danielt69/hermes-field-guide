## The mental model

Hermes is not "a chatbot with plugins". It is easier to reason about as a stack of layers. The model does the reasoning, and Hermes supplies continuity, procedures, reach and guardrails around it. When something goes wrong, first work out which layer failed.

### Seven layers

| Layer | What it owns | Where it lives |
|---|---|---|
| Model | Reasoning and language | `hermes model`, `/model` |
| Tools | Actions: terminal, files, web, browser, delegation, cron | `hermes tools` |
| Skills | Reusable procedures loaded on demand | `~/.hermes/skills/`, `hermes skills` |
| Memory & context | Curated facts, project rules, searchable history | `MEMORY.md`, `USER.md`, `AGENTS.md`, session store |
| Profiles | Isolated homes: config, keys, memory, sessions, skills | `hermes profile` |
| Reach & automation | Messaging gateway, cron, webhooks, Kanban | `hermes gateway`, `hermes cron`, `hermes kanban` |
| Surfaces | CLI, TUI, Desktop app, web dashboard | `hermes`, `hermes --tui`, `hermes desktop`, `hermes dashboard` |

The last row is the newest. The official Desktop page describes the CLI, TUI, Desktop app and dashboard as front ends that share one agent core, config, sessions, skills and memory. That means a session can start in one surface and resume in another ([Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)).

### What this guide covers that the July version did not

The July field guide covered the first six layers. This edition adds material that was either missing from that guide or has changed since it was written. Treat this list as a statement about guide coverage, not as release dates:

- **Surfaces:** the native Desktop app, the TUI (which the docs call "the recommended way to run Hermes interactively"), and a local web dashboard ([TUI](https://hermes-agent.nousresearch.com/docs/user-guide/tui), [Dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)).
- **Durable multi-agent work:** a SQLite-backed Kanban board shared across profiles. Named profiles act as worker lanes, and every handoff is recorded ([Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban), [Worker lanes](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-worker-lanes)).
- **Goals:** `/goal` keeps a single session iterating until a judge model says the goal is done. Quality gates can require a shell command to pass first ([Goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals)).
- **Extensible memory:** optional external memory providers run alongside the built-in files. Only one provider can be active at a time ([Memory providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)).
- **Native MCP management:** a reviewed catalog, `hermes mcp install/test/configure`, and `hermes mcp serve` ([MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)).
- **Skills lifecycle:** hub trust levels, write-approval gates, the curator for agent-created skills, and the `hermes journey` timeline ([Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [Curator](https://hermes-agent.nousresearch.com/docs/user-guide/features/curator)).

### Native, optional, or pattern

Each recommendation in this guide falls into one of three categories:

- **Native:** ships with Hermes and is documented, for example profiles, cron and built-in memory.
- **Optional provider:** you choose it and it may need keys or extra installs, for example an external memory provider, ElevenLabs, or a specific MCP server.
- **Design pattern:** a way of working that this guide recommends but Hermes does not enforce, for example "one-shot before recurring" or "inspect before edit".

### This is a static guide

This guide is a dated snapshot, researched on 30 September 2026 against upstream commit `f42f579cf8bac4918ac9599bece71618afadd846`. It is not a control panel. It cannot see your machine, your gateway or your skill count, and it shows no live status. When the guide and your installed version disagree, trust `hermes <command> --help` and the [live docs](https://hermes-agent.nousresearch.com/docs/).

Start with [your first session](#/first-session). For the two capstone builds, see [Build your J.A.R.V.I.S.](#/jarvis) and [Build a startup team](#/startup-team).

### Sources

- [Features overview](https://hermes-agent.nousresearch.com/docs/user-guide/features/overview)
- [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [TUI](https://hermes-agent.nousresearch.com/docs/user-guide/tui)
- [Web dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)
- [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban)
- [Kanban worker lanes](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-worker-lanes)
- [Persistent goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals)
- [Memory providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
- [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Curator](https://hermes-agent.nousresearch.com/docs/user-guide/features/curator)

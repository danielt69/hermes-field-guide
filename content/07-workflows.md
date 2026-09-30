## Workflows that hold up

Output quality comes from **task contracts**: scope, authority, required evidence and a definition of done. Elaborate prompts do not substitute for them. The contracts below are design patterns, not Hermes features.

### Inspect → plan → execute → verify

1. **Inspect.** "Inspect the repo and relevant docs. Do not edit. Report findings, unknowns and the smallest safe next step."
2. **Plan**, only when the work has several steps. `/plan <task>` writes a markdown plan under `.hermes/plans/` without executing anything ([Slash commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)).
3. **Execute to proof.** "Implement the smallest complete change. Run tests and type checks, inspect the diff, fix failures, then report exact evidence."
4. **Verify independently.** `/review` starts a separate reviewer subagent that checks the work just discussed.

If Hermes is drifting mid-task, use `/steer` to add a constraint without stopping it.

### Delivery recipes

- **Research brief:** "Use current primary sources. Separate facts, inference and recommendation. Link every claim and note conflicting evidence."
- **Frontend delivery:** "Plan the smallest complete change, implement, run relevant tests and type checks, then report the files changed and the verification output."
- **Agentic review:** "Run independent security, performance, UX and maintainability reviews. Deduplicate findings, rank them by impact and confidence, and separate must-fix issues from optional ones."
- **Product discovery:** "Compare five approaches to [problem], map the trade-offs, then propose an MVP with data flow, tool boundaries and risks."

### Ephemeral or durable?

| Need | Use | Why |
|---|---|---|
| A quick parallel answer, returned into this chat | `delegate_task` | Like an RPC call; nothing is left behind |
| Keep iterating on one objective in this session | `/goal` with `/goal gate add <cmd>` | A judge and a deterministic gate decide when it is done |
| Work that survives restarts or involves several roles or humans | Kanban | Durable rows, named profiles, full audit trail |

The docs say plainly that background delegation is **not** durable execution. A process restart does not resume a running child ([Delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation), [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban)).

### Give children explicit context

Subagents start with a fresh conversation. The only things they receive are the goal and context the parent passes in, plus the repo's project context files. They cannot write memory, ask you questions, send messages or schedule cron jobs. Delegate only independent questions, never tightly coupled edits to the same files:

```text
Delegate three independent reviews (security, performance, UX) of the diff in
~/Projects/app on branch feat/login. For each child pass: repo path, diff scope
(git diff main...feat/login), constraints (read-only, no network installs), and
required output (findings with file:line, severity, confidence). Synthesize
after all three return.
```

### Require real acceptance evidence

Accept "done" only when there is evidence behind it. The Kanban docs suggest a handoff shape worth using everywhere: `changed_files`, `verification` (the exact commands run), `dependencies`, `blocked_reason`, `retry_notes` and `residual_risk`. Keep secrets and raw logs out of it. A commit alone does not complete a task.

These patterns scale up into [Build a startup team](#/startup-team).

### Sources

- [Subagent delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation)
- [Delegation patterns](https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns)
- [Persistent goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals)
- [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban)
- [Slash commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)
- [Tips & best practices](https://hermes-agent.nousresearch.com/docs/guides/tips)

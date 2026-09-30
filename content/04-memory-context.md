## Memory and context

Hermes has no single unified memory. It has five separate stores, and each one does a different job. Most memory problems come from putting information in the wrong one.

| Store | Holds | Lifetime | Cost |
|---|---|---|---|
| Working context | The current conversation and tool output | This session (compressed when it gets long) | Every turn |
| Curated memory | `MEMORY.md` (about 2,200 chars) and `USER.md` (about 1,375 chars) | Across sessions, per profile | Fixed per session |
| Skills | Procedures | Across sessions, loaded on demand | Only when loaded |
| Session search | All past sessions, searched with FTS5 | Until pruned | Only when queried |
| Project context files | `AGENTS.md` and similar files in the repo | As long as your git history | Every session in that repo |

The sizes and behaviour above come from the docs ([Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)).

### Curated memory

Built-in memory is deliberately small. It is injected as a **frozen snapshot** when a session starts, so edits appear from the next session onward. It never compacts itself: when a write would exceed the limit, the tool returns an error and the agent has to consolidate entries. Save stable preferences, environment facts and lessons learned. Skip task progress and anything that belongs in a repo.

```yaml
memory:
  write_approval: true   # optional: review writes with /memory pending
```

To find a past discussion, ask Hermes to search it, for example "did we decide X last week?". That query goes to `session_search`, not to memory. Sessions are auto-pruned after `sessions.retention_days` (default 90) ([Sessions](https://hermes-agent.nousresearch.com/docs/user-guide/sessions)).

### Context file precedence

Only **one** project context type loads per session, and the first match wins ([Context files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)):

1. `.hermes.md` / `HERMES.md` (walks up to the git root)
2. `AGENTS.override.md`, a personal, usually gitignored file that replaces `AGENTS.md`
3. `AGENTS.md`
4. `CLAUDE.md`
5. `.cursorrules` / `.cursor/rules/*.mdc`

Inside a git repo, Hermes merges the chain of `AGENTS.md` files from the git root down to your working directory, and the deeper files take precedence. Subdirectory files are discovered progressively as the agent works in those directories. `SOUL.md` is the separate identity file. It loads only from `HERMES_HOME` and never from the project.

Recommended pattern: keep a focused `AGENTS.md` in every active repo covering architecture, commands, conventions, test gates and your definition of "done". That is the knowledge you share with collaborators and other agents.

### Profile isolation and external providers

Memory is scoped per [profile](#/profiles-models). Never point two agent processes at the same Hermes home, because each one would load the other's memory writes.

If you want deeper recall, an **optional** external provider can run *alongside* the built-in files. Only one can be active at a time, and its data is isolated per profile ([Memory providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)):

```bash
hermes memory status
hermes memory setup     # interactive picker; may need keys or services
hermes memory off       # back to built-in only
```

`hermes memory reset` erases `MEMORY.md` and `USER.md`. Treat it as destructive.

Do not stack overlapping providers in the hope of building one "master memory". For knowledge shared across a team of agents, use repo files and Kanban comments, as in [Build a startup team](#/startup-team).

### Sources

- [Persistent memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Memory providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
- [Context files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)
- [Sessions](https://hermes-agent.nousresearch.com/docs/user-guide/sessions)
- [Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)

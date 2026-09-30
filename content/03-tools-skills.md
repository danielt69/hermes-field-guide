## Tools and skills

**Tools** are things Hermes can do right now: terminal, file edits, web search, browser, vision, `delegate_task`, cron and so on. They are grouped into toolsets and enabled per platform. **Skills** are `SKILL.md` documents that describe how to do something well: the steps, the pitfalls and how to verify the result. Hermes reads skill descriptions cheaply and loads a skill's full body only when a task needs it ([Tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools), [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)).

Rule: use the smallest toolset that can both finish the work and verify it.

### Enable tools deliberately

```bash
hermes tools                              # interactive per-platform UI
hermes tools list --platform cli
hermes tools enable web                   # changes config for the cli platform
hermes tools disable browser --platform telegram
```

Tool schemas are fixed when a session starts, so start a new session (`/new`) after changing tools. MCP tools use `server:tool` notation in these same commands.

### Discover and install skills safely

```bash
hermes skills search react
hermes skills inspect <identifier>        # preview before installing
hermes skills install <identifier>        # runs a security scan first
hermes skills list --source hub
```

Hub installs are scanned for exfiltration, prompt injection and destructive commands. Trust levels are `builtin`, `official`, `trusted` and `community`. `--force` can override a caution-level finding but **never** a `dangerous` verdict. Read the inspected source before you use `--force` ([Skills Hub](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)).

Every installed skill becomes a slash command. You can stack up to five skills at the start of one message:

```text
/github /test-driven-development fix issue #123 and open a PR
```

If a skill's name clashes with a built-in command, load it with `/skill <name>` instead ([Slash commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)).

### Curate reusable knowledge

- `/learn <source>` distils a skill from a directory, a URL or a workflow you just walked through. `/plan` and `/init` (which generates `AGENTS.md`) are now built-in commands.
- The agent can write skills itself. Set `skills.write_approval: true` if you want to review those writes first, using `/skills pending`, `/skills diff <id>`, and `/skills approve <id>`.
- The curator marks unused agent-created skills stale and then archives them. Archives are recoverable. Preview what it would do before trusting it:

```bash
hermes curator status
hermes curator run --dry-run
hermes curator pin <skill>
hermes journey                 # timeline of learned skills and memories
```

### Focused skill shortlist

These entries appear in the documentation catalog at the pinned commit. Your installation may differ, so confirm with `hermes skills list`.

- Bundled: `github` (PRs, issues, reviews via `gh`; the documentation describes it as consolidating six earlier skills), `codebase-inspection`, `test-driven-development`, `systematic-debugging`, `requesting-code-review`, `claude-design`, `arxiv`, `youtube-content`, `hermes-agent`.
- Optional: `excalidraw`, installed with `hermes skills install official/creative/excalidraw`.

The July guide listed `plan` as a skill; planning is now the `/plan` built-in. The old `github-pr-workflow` name does not appear in the current catalog. Where your skills come from matters for memory too; see [Memory & context](#/memory-context).

### Sources

- [Tools & toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)
- [Toolsets reference](https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference)
- [Skills system](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Bundled skills catalog](https://hermes-agent.nousresearch.com/docs/reference/skills-catalog)
- [Optional skills catalog](https://hermes-agent.nousresearch.com/docs/reference/optional-skills-catalog)
- [Curator](https://hermes-agent.nousresearch.com/docs/user-guide/features/curator)
- [Slash commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)

## Command reference

These commands were checked against `hermes <command> --help` and the CLI reference at the pinned commit. Flags change between versions. If a flag is missing from your `--help` output, do not use it.

**CLI commands** are typed in your shell. **Slash commands** are typed inside a session. `hermes model` and `/model` are different tools: only the CLI version can add providers.

### CLI (shell)

```bash
hermes --tui                          # TUI; `hermes` = classic CLI
hermes -c                             # resume latest session
hermes chat --oneshot -q "..."        # answer and exit
hermes -z "..."                       # final text only, for scripts
hermes chat --safe-mode -q "..."      # no config/rules/plugins/MCP
hermes doctor | hermes status --all
hermes model | hermes fallback list | hermes auth list
hermes config get <key> | hermes config set <key> <value>
hermes tools list --platform cli
hermes skills search|inspect|install|list
hermes mcp catalog|install|add|test|configure|serve
hermes plugins search|install|list|enable|disable
hermes memory status|setup|off
hermes profile list|create|export
hermes cron list|create|run|runs|pause|resume|doctor
hermes kanban init|create|list|show|watch
hermes gateway setup|status|start|stop
hermes send --to telegram "deploy finished"
hermes sessions list|browse|export
hermes logs errors -n 100 | hermes logs -f
hermes prompt-size | hermes insights --days 7
hermes backup --quick | hermes pause | hermes resume
```

### Slash (in session)

```text
/help  /status  /context  /usage  /model  /tools  /skills  /title
/new  /retry  /undo  /stop  /steer <note>  /queue <prompt>  /compress
/plan  /init  /learn  /review  /goal <text>  /goal gate add <cmd>
/loop  /heartbeat  /cron  /kanban  /rollback  /reload-mcp  /voice on
/<skill-name>  /skill <name>
```

### Troubleshooting: symptom → check → verify

| Symptom | Check | Verify |
|---|---|---|
| Empty or broken replies | `hermes model`, `hermes auth status <provider>` | One short `--oneshot` chat succeeds |
| Is it my setup or Hermes itself? | `hermes chat --safe-mode -q "hello"` | Safe mode works, so bisect your config, plugins and MCP |
| New tool or skill missing | Was a new session started? `hermes tools list` | `/tools` shows it |
| MCP tools absent | `hermes mcp test <name>`, then `/reload-mcp` | The tool appears in `/tools` |
| `-c` can't find a session | Wrong profile? `hermes sessions list` | The session appears under `-p <profile>` |
| Gateway silent | `hermes gateway status`, `hermes logs gateway` | A message from an allowlisted user gets a reply |
| Cron not firing | `hermes cron doctor`, `hermes cron runs <id>` | A manual `hermes cron run <id>` completes |
| Context feels crowded | `/context`, `hermes prompt-size` | Fewer toolsets or MCP tools, or `/compress` |
| Memory "forgotten" | It was written mid-session? | It appears after `/new` |

When you need help, `hermes dump` prints a setup summary you can paste. Review it before sharing.

### Sources

- [CLI commands reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Slash commands reference](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)
- [Quickstart: common failure modes](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)
- [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Scheduled tasks (cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)

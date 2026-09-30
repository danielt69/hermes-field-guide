## Sources and methodology

### How this guide was researched

- **Research date:** 30 September 2026.
- **Upstream snapshot:** NousResearch `hermes-agent` at commit `f42f579cf8bac4918ac9599bece71618afadd846`. The docs were read from `website/docs` in that commit (MIT licence).
- **Syntax checks:** command shapes were checked with read-only `hermes <command> --help` calls against an install at the same commit. No profiles, jobs, credentials or tasks were created while writing the guide.
- **Primary sources only:** the official documentation, cited next to each claim and listed at the end of every chapter. Third-party blogs and videos were not used as authority.
- **Labels:** each claim is marked as a native capability, an optional provider, or a recommended design pattern (see [Overview](#/overview)).

This is a **dated snapshot**, not a feed that updates itself. Hermes changes quickly. Treat every command here as correct as of the pinned commit, and treat the [live docs](https://hermes-agent.nousresearch.com/docs/) plus your local `--help` output as the authority after that.

### Official source register

| Area | URL |
|---|---|
| Docs home | https://hermes-agent.nousresearch.com/docs/ |
| Quickstart | https://hermes-agent.nousresearch.com/docs/getting-started/quickstart |
| CLI commands | https://hermes-agent.nousresearch.com/docs/reference/cli-commands |
| Slash commands | https://hermes-agent.nousresearch.com/docs/reference/slash-commands |
| Configuration | https://hermes-agent.nousresearch.com/docs/user-guide/configuration |
| Desktop | https://hermes-agent.nousresearch.com/docs/user-guide/desktop |
| TUI | https://hermes-agent.nousresearch.com/docs/user-guide/tui |
| Dashboard | https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard |
| Tools | https://hermes-agent.nousresearch.com/docs/user-guide/features/tools |
| Skills | https://hermes-agent.nousresearch.com/docs/user-guide/features/skills |
| Curator | https://hermes-agent.nousresearch.com/docs/user-guide/features/curator |
| Memory | https://hermes-agent.nousresearch.com/docs/user-guide/features/memory |
| Memory providers | https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers |
| Context files | https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files |
| Profiles | https://hermes-agent.nousresearch.com/docs/user-guide/profiles |
| MCP | https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp |
| Plugins | https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins |
| Delegation | https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation |
| Goals | https://hermes-agent.nousresearch.com/docs/user-guide/features/goals |
| Kanban | https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban |
| Cron | https://hermes-agent.nousresearch.com/docs/user-guide/features/cron |
| Messaging | https://hermes-agent.nousresearch.com/docs/user-guide/messaging |
| Security | https://hermes-agent.nousresearch.com/docs/user-guide/security |
| Voice & TTS | https://hermes-agent.nousresearch.com/docs/user-guide/features/tts |
| Local models | https://hermes-agent.nousresearch.com/docs/user-guide/local-models |

### Maintaining this guide

1. Re-check the guide whenever you run `hermes update`, or at least monthly.
2. For every command in a chapter, compare it against `hermes <cmd> --help`, and remove any flag that has disappeared.
3. Open every Sources link and fix any that return 404.
4. Update the research date and the commit hash together, and never update one without the other.
5. Do not add live status such as models, skill counts or gateway state; it goes stale immediately.

### Credits

This guide merges two earlier personal guides with identical content:

- https://github.com/danielt69/hermes-field-guide
- https://github.com/danielt69/hermes-for-daniel

Hermes Agent is built by Nous Research. This guide is an independent, opinionated layer over the official docs.

### Sources

- [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/)
- [CLI commands reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Updating](https://hermes-agent.nousresearch.com/docs/getting-started/updating)

## Advanced chapters: verification log

Scope: `content/13-jarvis.md`, `content/14-startup-team.md`, `public/templates/*`.
Date: 2026-09-30. Hermes: `Hermes Agent v0.21.5+4905.gf42f579` (install and upstream clone both at `f42f579cf8bac4918ac9599bece71618afadd846`).

### Method

1. Read official docs from the local clone (`website/docs`). Four pages were also fetched live from https://hermes-agent.nousresearch.com/docs (profiles, memory, kanban, multi-profile-gateways). All four returned HTTP 200, and each contains the key phrases the chapters rely on ("does not get a gateway of its own", `memories/MEMORY.md`, `dispatch_in_gateway`, "2,200 chars").
2. Captured `hermes <subcommand> --help` for about 125 subcommands. `HERMES_HOME` was pointed at a throwaway directory (`~/.hermes/cache/scratch/hhome`), so no real profile, config, memory, gateway, board or cron job was read or changed. Every capture exited with rc=0. Raw logs: `~/.hermes/cache/scratch/helps.txt` (103 sections) and `helps2.txt` (22 sections).
3. Where help text and docs differed, or were silent, I read the source.
4. Ran `check_adv.py` (read-only) to parse the YAML templates, compare their keys with `hermes_cli/config_defaults.py`, check chapter structure, resolve template links, and scan for secrets.

No `init`, `create`, `setup`, `gateway`, `cron`, `kanban`, `memory` or `mcp` mutation was executed. No live accounts or integrations were tested.

### Command and flag checks (help output)

| Command used in chapters | Verified flags |
|---|---|
| `hermes profile create` | `--clone --clone-all --clone-from --clone-channels --sync-imports --no-alias --no-skills --description` |
| `hermes profile show / export -o / import --name / describe --text --auto` | present |
| `hermes kanban init`, `boards create --name --description --default-workdir --switch`, `kanban --board <slug>` | present |
| `hermes kanban create` | `--body --body-file --assignee --parent(repeatable) --workspace --branch --skill --max-runtime --max-retries --model --provider --goal --goal-max-turns --completion-contract --idempotency-key --json` |
| `kanban link/unlink/assign/reassign --reclaim --reason/comment --author/complete --summary --metadata/block --kind/unblock --reason` | present |
| `kanban show/runs/log --tail/tail/watch --kinds/context/diagnostics/stats/assignees/dispatch --dry-run/set-model/swarm/decompose` | present |
| `kanban notify-subscribe --platform --chat-id --notifier-profile --delivery-mode {notify,notify+wake,wake}` | present |
| `kanban daemon` | present but labelled DEPRECATED in help; the chapters do not recommend it |
| `hermes tools list/enable/disable --platform`, `tools post-setup piper` | present (`piper` is a listed post-setup key) |
| `hermes memory setup/status/off/reset` | present |
| `hermes cron create --name --deliver --skill --workdir --paused --paused-reason --pin`, `cron list --all`, `cron resume`, `cron run`, `cron runs --limit` | present |
| `hermes gateway install/start/status/setup` | present; per-profile start refuses without `--force` (per docs) |
| `hermes webhook subscribe --route-profile --events --prompt --deliver` | present |
| `hermes mcp add --command --args --env`, `mcp test` | present (`--args` must be the last option) |
| `hermes approvals test -- <cmd>` | present; never executes the command |
| `hermes backup -o`, `hermes pause --reason`, `hermes resume`, `insights --days`, `usage`, `logs gateway -f -n`, `sessions list --limit`, `journey list/edit/delete`, `config set/edit/check`, `fallback add/list`, `chat -s --run-budget --max-turns` | present |

### Source-level confirmations

| Claim | Evidence |
|---|---|
| `--clone` copies `MEMORY.md` / `USER.md` (help text omits this) | `hermes_cli/profiles.py:39` `_CLONE_SUBDIR_FILES`; profiles.md |
| Workers run `hermes -p <assignee> --cli --accept-hooks [--skills] [--toolsets <profile cli toolsets>] chat -q "work kanban task <id>"` | `hermes_cli/kanban_db_dispatch.py` `_worker_argv`, `_resolve_worker_cli_toolsets` |
| `TERMINAL_CWD` is pinned to the task workspace, so the repo's `AGENTS.md` loads | `kanban_db_dispatch.py` `_default_spawn` |
| Worktree lands at `<repo>/.worktrees/<task-id>`, branch `wt/<task-id>`, anchored on board `default_workdir` (dispatch errors if unset) | `hermes_cli/kanban_db_workspace.py` `_resolve_worktree_workspace` |
| Board DB is under the root Hermes home and shared across profiles | `kanban_db.py` `kanban_home()` |
| Edge TTS sends text to Microsoft's online service (uses the `edge_tts` library) | `tools/tts_tool_providers.py:196-203` in the install tree |
| Overlay YAML keys exist | all 29 leaf keys found in `config_defaults.py` (check output below) |
| Defaults cited: `failure_limit` 2, `dispatch_in_gateway` true, `review_dispatch` true, `memory.write_approval` false | `config_defaults.py` |

### Automated check output (summary)

```text
YAML overlays: 3 parsed OK (jarvis-profile, kanban-host, specialist-profile)
overlay leaf keys: 29 found, 0 absent
content/13-jarvis.md words: 2123 H1: 0 frontmatter: False html tags: 0 fences balanced: True Sources: True
content/14-startup-team.md words: 2074 H1: 0 frontmatter: False html tags: 0 fences balanced: True Sources: True
template links: 13 ok, 0 missing
secret-like strings in templates: all clean
```

### Known limitations

- Help output shows that flags exist, not how they behave at runtime. Dispatch, worker spawning, handoff propagation, voice, wake word, the gateway, webhooks and MCP were not exercised.
- Provider, model and platform names in the templates are placeholders on purpose. Real values come from `hermes model`. I did not read the user's personal settings.
- The official site renders through a JavaScript bundle. The live check was a phrase match on fetched HTML, not a full content diff.
- The chapter's word count for 13 (about 2,120 words, including code) is within the 1,300–2,200 target. Chapter 14 is about 2,070 words, just above the lower end of its 1,700–2,600 target.
- Two claims are recommendations, not Hermes features: the ownership and integration rules, and the single-writer memory policy. They depend on operator discipline plus approvals and deny rules. They are not OS isolation.
- The `agent-merge-conflict-arbiter` skill is an optional skill. It must be installed on the reconciling profile before a card can reference it with `--skill`.

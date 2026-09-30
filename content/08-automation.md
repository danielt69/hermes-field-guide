## Automation

Automate last. Turn a manual workflow into a schedule only after it has succeeded by hand, never the other way round.

### Messaging gateway

```bash
hermes gateway setup      # interactive platform setup (Telegram, Discord, Slack, ...)
hermes gateway status
```

Restrict who can reach the bot with per-platform allowlists such as `TELEGRAM_ALLOWED_USERS`, or with DM pairing. Use `/sethome` in a chat to mark it as the home channel for deliveries ([Messaging](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)).

### Pick the right trigger

| Trigger | Scope | Survives restarts |
|---|---|---|
| `/goal`, `/loop`, `/heartbeat` | Inside the current session | No; tied to the session |
| `hermes cron` | A fresh agent run per fire | Yes |
| `hermes webhook subscribe` | External events (HMAC-signed) | Yes; needs the webhook platform enabled |

Sources: [Loops](https://hermes-agent.nousresearch.com/docs/user-guide/features/loops), [Heartbeat](https://hermes-agent.nousresearch.com/docs/user-guide/features/heartbeat), [Webhooks](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks).

### One-shot before recurring

1. Create the job **paused** as a canary, pinning the model and naming explicit delivery targets:

   ```bash
   hermes cron create "every day at 8am" \
     "Brief me on AI agent releases from primary sources; links only, max 300 words." \
     --name "Morning brief" --deliver telegram --failure-deliver local \
     --pin --paused --paused-reason "Canary: review first output"
   ```

2. Trigger it once and read the result:

   ```bash
   hermes cron list --all
   hermes cron run <job_id>
   hermes cron runs <job_id>
   ```

3. Resume it only if that output was useful: `hermes cron resume <job_id>`.

A schedule such as `in 30m` or an ISO timestamp runs once. Use `--skill` to attach only the skills the job needs, and `--workdir` to load a repo's `AGENTS.md`. Unpinned jobs follow whatever your current model is when they fire. Pinned jobs never fall back to another provider ([Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)).

### Lifecycle, budget, notification, retention

- **Health:** `hermes cron doctor` is read-only and exits non-zero while any finding stands. `hermes cron incidents` records durable failures.
- **Notification:** failures go to `--deliver` unless you override them with `--failure-deliver`. Delivered output is secret-redacted.
- **Safety:** cron runs deny dangerous commands by default (`approvals.cron_mode: deny`), and a cron run cannot create more cron jobs.
- **Budget:** `/goal` stops after `goals.max_turns` (default 20). `hermes chat --run-budget SECONDS` caps a one-shot run. `hermes insights` shows usage history. None of these guarantees a cost ceiling.
- **Retention:** cron attempt history is bounded, and sessions auto-prune after 90 days by default.
- **Emergency stop:** `hermes pause` halts new cron, Kanban and gateway work without killing work already in flight. `hermes resume` lifts it.

For script-only pings that need no LLM at all, see `--no-agent` and `hermes send` in [Command reference](#/command-reference).

### Sources

- [Scheduled tasks (cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Automate with cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron)
- [Messaging gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)
- [Webhooks](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks)
- [Recurring loops](https://hermes-agent.nousresearch.com/docs/user-guide/features/loops)
- [Session heartbeats](https://hermes-agent.nousresearch.com/docs/user-guide/features/heartbeat)
- [Persistent goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [CLI commands reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)

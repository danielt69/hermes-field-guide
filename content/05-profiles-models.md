## Profiles and models

### Profiles are identity boundaries

A profile is a separate Hermes home. It has its own `config.yaml`, `.env`, `SOUL.md`, memory, sessions, skills, cron jobs and gateway state. Creating a profile also creates a command alias with the same name ([Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)).

The commands in this block **create state**. Run them deliberately:

```bash
hermes profile create coder --description "Frontend and TypeScript delivery"
hermes profile create research --description "Source-first research briefs"
hermes profile list
coder chat                      # or: hermes -p coder chat
```

`--clone` copies config, `.env`, `SOUL.md` and skills from the active profile. Messaging bot tokens are left behind unless you pass `--clone-channels`. `hermes profile use <name>` changes your **sticky default** profile, so only run it if that is what you want.

What profiles do **not** do is sandbox anything. On the `local` backend the agent can still reach any path your user account can. To give a profile a predictable starting directory, set an absolute `terminal.cwd`. For real isolation, use a container backend (see [Local workbench](#/local-workbench)).

### Models and providers

```bash
hermes model        # from your shell: add providers, OAuth, keys, set the default
```

Inside a session, `/model provider:model` switches **only between providers you have already configured**, and only for that session. Add `--global` to save the switch to config. Secrets belong in `.env` and everything else in `config.yaml`. `hermes config set` routes `UPPER_SNAKE` keys to `.env` automatically ([CLI reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)).

Hermes requires a model context window of at least 64K tokens ([Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)).

### Resilience, and its limits

Credential pools and fallback are optional, and they solve different problems:

- **Credential pools** rotate between several keys for the *same* provider. They are tried first ([Credential pools](https://hermes-agent.nousresearch.com/docs/user-guide/features/credential-pools)).
- **Fallback providers** switch to a *different* provider and model when errors occur ([Fallback](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers)).

```bash
hermes auth list
hermes fallback list
```

Limits to plan around:

- Fallback is **per turn**: the primary provider is restored on your next message.
- Rotating keys or providers resets the prompt cache, so the next request pays for the full context again.
- Cron jobs pinned to their own provider or model do **not** fall back. If that route fails, the run fails.

Add a second provider only once the base setup is stable. For unattended work, choose models explicitly rather than letting defaults drift underneath the jobs.

### Safe configuration defaults

| Setting | Documented default | Advice |
|---|---|---|
| `approvals.mode` | `smart` | Keep `smart` or `manual`; avoid `off` |
| `security.redact_secrets` | `true` | Leave it on |
| `checkpoints.enabled` | `false` | Use `--checkpoints` for big edit sessions |
| `terminal.backend` | `local` | Use `docker` for untrusted code |

Inspect a value with `hermes config get <key>`. The command masks credential-shaped values.

### Sources

- [Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)
- [Profile commands](https://hermes-agent.nousresearch.com/docs/reference/profile-commands)
- [Configuring models](https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models)
- [Credential pools](https://hermes-agent.nousresearch.com/docs/user-guide/features/credential-pools)
- [Fallback providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers)
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)

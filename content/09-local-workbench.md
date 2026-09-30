## Local workbench on a Mac

A capable Apple Silicon Mac removes many practical constraints. It does not remove the need to bound work, isolate risk and choose the right lane for each job. This chapter makes no throughput or model-size promises. Measure on your own machine.

### Lanes

| Lane | Use for | How |
|---|---|---|
| Desktop app | Chat with previews, file browser, live subagents | `hermes desktop`. macOS on Apple Silicon is a Tier 1 platform ([Platform support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)) |
| Local terminal | Trusted projects, local servers, tests | Default `local` backend |
| Container | Untrusted code, risky installs | `terminal.backend: docker` |
| Worktree | Parallel agents on one repo | `hermes chat --worktree` |
| Background | Long builds with a completion notice | Tracked background processes; use cron for durable schedules |

Note from the security docs: on container backends the dangerous-command check is skipped because the container is treated as the boundary. On `local` the check runs, but there is no isolation at all ([Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)).

### Voice: know what touches the network

- **Edge TTS** is the default text-to-speech provider. It is free and needs no key, but it is a **network service**; neither the TTS docs nor this guide calls it local.
- **Local STT (faster-whisper)** is the default speech-to-text provider where it is supported. It downloads its model from Hugging Face on first use and then runs on your machine. It is not available on Intel Macs.
- **Piper, KittenTTS and NeuTTS** are local TTS options ([TTS](https://hermes-agent.nousresearch.com/docs/user-guide/features/tts)).

Daniel's preference is an example of a TTS voice worth pinning: an Ava multilingual Edge voice. Confirm the exact voice ID against Edge's voice list before saving it. This guide did not verify the ID.

```yaml
tts:
  provider: "edge"
  edge:
    voice: "<your confirmed Ava multilingual voice id>"
stt:
  provider: "local"
  local:
    model: "base"
```

Inside a session: `/voice on`, then press `Ctrl+B` to record, and `/voice tts` for spoken replies ([Voice mode](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode)).

### Local models

There are two documented paths:

- In the Desktop app, **Settings → Providers → Local Models** manages a llama.cpp server for you. It is enabled on canary builds; other builds need the `--local` launch flag ([Local models](https://hermes-agent.nousresearch.com/docs/user-guide/local-models)).
- Manually: `brew install llama.cpp`, start a server, then `hermes model` → **Custom endpoint** ([Local LLMs on Mac](https://hermes-agent.nousresearch.com/docs/guides/local-llm-on-mac)).

Caveats:

- Hermes rejects models with less than 64K context.
- Compare quality and latency against your hosted model before routing real work to a local one.
- Use local models for a reason, such as privacy or offline use, not simply because the memory is there.

### Backup and separation

Pair profiles with project workspaces. Keep project instructions in git, not only in `~/.hermes`.

```bash
hermes backup --quick --label "pre-change"
hermes backup -o ~/Backups/hermes-full.zip
hermes profile export coder -o ~/Backups/coder.tar.gz
```

Backups skip browser credential stores and caches that can be regenerated.

### Sources

- [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [Platform support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)
- [Voice & TTS](https://hermes-agent.nousresearch.com/docs/user-guide/features/tts)
- [Voice mode](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode)
- [Local models](https://hermes-agent.nousresearch.com/docs/user-guide/local-models)
- [Run local LLMs on Mac](https://hermes-agent.nousresearch.com/docs/guides/local-llm-on-mac)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [CLI commands reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)

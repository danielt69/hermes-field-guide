## Your first session

Before you add integrations, get one clean path from request to verified result working end to end. The quickstart's rule of thumb is: if Hermes cannot complete a normal chat, do not add more features yet ([Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)).

### 1. Check the baseline

All four commands below only read state:

```bash
hermes doctor              # exits non-zero if unresolved problems remain
hermes status --all        # redacted, shareable component summary
hermes tools list          # enabled/disabled toolsets for the CLI platform
hermes skills list         # installed skills
```

Success check: you can name your active provider and model, and `doctor` reports no unresolved errors. If provider auth is broken, run `hermes model` from your shell, not from inside a chat ([CLI reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)).

### 2. Run a real task that only reads

Start with inspection, so you can see how Hermes gathers context before it is allowed to edit anything. Run this from inside a project directory:

```bash
hermes chat --oneshot -q "Inspect this project. Do not edit files. Map the architecture, list the top five risks with file paths as evidence, and propose a prioritized plan."
```

`--oneshot` answers and exits. Without it, on a real terminal, `-q` only seeds an interactive session. In one-shot mode, dangerous commands are denied by default (`approvals.single_query_mode: deny`), because nobody is present to approve them ([Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)).

Success check: every risk in the answer cites a real file you can open. If a claim has no evidence behind it, ask again and require evidence. The exit code is `0` only when the turn completed.

### 3. Work interactively

```bash
hermes --tui          # the TUI; plain `hermes` starts the classic CLI
hermes -c             # resume the most recent session
```

Practise these slash commands inside a session: `/help`, `/status`, `/model`, `/tools`, `/skills`, `/title`, `/retry`, `/undo`, `/stop`, `/new`. If a long turn is heading the wrong way, use `/steer <note>` to redirect it after the next tool call, or `/queue <prompt>` to hold a message for later ([Slash commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)).

Success check: you can stop a turn, retry it, undo an exchange and start fresh. Then `hermes sessions list` shows the sessions you created.

### 4. Know your safety net

- The approval mode defaults to `smart`, which auto-approves low-risk commands, denies clearly dangerous ones and asks you about uncertain cases. Avoid permanent YOLO mode.
- Secret redaction is on by default.
- Filesystem checkpoints are **opt-in**. For a substantial editing session, start with `hermes chat --checkpoints` so that `/rollback` has snapshots to restore ([Checkpoints](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback)).

### 5. Teach one durable preference

Tell Hermes: "Remember that I prefer implementation answers with copyable commands, verification output, and explicit assumptions."

Memory is written to disk straight away, but the system prompt uses a snapshot frozen at session start. You will see the effect from the **next** session onward ([Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)). The difference between memory and task context is covered in [Memory & context](#/memory-context).

### Sources

- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [CLI commands reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Slash commands reference](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)
- [TUI](https://hermes-agent.nousresearch.com/docs/user-guide/tui)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Checkpoints and rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback)
- [Persistent memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)

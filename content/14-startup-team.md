This chapter is a recipe for running a small startup team of Hermes profiles that work toward one shared goal and report to JARVIS. It covers:

- a durable Kanban board
- a versioned shared-context repository
- git worktrees, one per task
- structured handoffs between tasks

Nothing here runs automatically. This website is not an agent dashboard. Each command was checked against `hermes <subcommand> --help` (Hermes v0.21.5, upstream `f42f579`) and the official [Kanban docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban). Sections labelled **recommendation** are this guide's architecture, not built-in features.

## The model: private profiles, explicit shared layer

Profiles never share memory automatically. Each one keeps its own `MEMORY.md`, sessions, `.env` and skills ([Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)). The team coordinates through three shared artifacts that you can inspect:

```text
SHARED (explicit, versioned)                PRIVATE (per profile, never symlinked)
  startup-hq/ git repo                        ~/.hermes/profiles/<name>/
    MISSION.md  TEAM.md  AGENTS.md              SOUL.md  memories/  state.db  .env
    DECISIONS.md  docs/  app/
  Kanban board "feedback-mvp"  (tasks, comments, run handoffs, attachments)
  Per-task git worktrees  <repo>/.worktrees/<task-id>  on branch wt/<task-id>
```

The board database lives under the root Hermes home and every profile can read it. Workers are spawned as `hermes -p <assignee> ... chat -q "work kanban task <id>"`. Each worker gets the assignee profile's own CLI toolsets and a working directory pinned to the task's workspace. That working directory means the repo's `AGENTS.md` is loaded for every task.

## Roles

| Profile | Role | Owns (write paths) | Tool policy (recommendation) |
|---|---|---|---|
| `jarvis` | Orchestrator; reports to you | Board cards, final summary | `kanban` enabled; does not implement |
| `product` | Product + user research | `docs/spec/` | file, web; no browser or computer use |
| `architect` | API contract, integration | `docs/api/`, integration branch | file, terminal |
| `design` | UX flows, UI copy | `docs/design/` | file, web |
| `frontend` | UI implementation | `app/web/` | file, terminal |
| `backend` | API and data | `app/api/` | file, terminal |
| `qa` | Tests + security review | `docs/qa/`, `tests/` | file, terminal, web |
| `growth` | Launch drafts and ops notes (never publishes) | `docs/launch/` | file, web |

For the pilot, merge roles: `product`, `builder` (architect, frontend and backend together) and `qa`, plus `jarvis`.

## Step 1 — Shared objective and definition of done

Fill in [`MISSION.md`](templates/MISSION.md) and [`TEAM.md`](templates/TEAM.md). MISSION.md records:

- the objective
- users
- the definition of done (DoD)
- non-goals
- budget and deadline
- the human decision gates
- a `context_version`

Example DoD: *"A local web app ingests a CSV of customer feedback, auto-tags each item (bug/feature/praise/other) with a documented rule set, lists items by tag, and exports CSV. `npm test` passes, QA report lists zero open high-severity findings, nothing is deployed or posted publicly."*

## Step 2 — Shared context repository

```bash
mkdir -p /ABSOLUTE/PATH/startup-hq && cd /ABSOLUTE/PATH/startup-hq && git init -b main
cp ~/Downloads/MISSION.md ~/Downloads/TEAM.md ~/Downloads/HANDOFF.md ~/Downloads/MEMORY-POLICY.md .
cp ~/Downloads/AGENTS.startup.md AGENTS.md
mkdir -p docs/spec docs/design docs/api docs/qa docs/launch app contracts
touch DECISIONS.md
git add -A && git commit -m "context v1.0.0" && git tag context-v1.0.0
```

[`AGENTS.startup.md`](templates/AGENTS.startup.md) tells every worker:

- read MISSION and TEAM first
- write only inside the paths it owns
- never push
- finish with the [`HANDOFF.md`](templates/HANDOFF.md) contract

The source of truth is the committed files on `main` at the tagged context version. If a card body conflicts with MISSION.md, the worker blocks with `needs_input` instead of guessing.

## Step 3 — Pilot profiles

Create the profiles without `--clone`, so none of them inherits your personal memory. Run setup for each (use the same flags for `builder` and `qa`):

```bash
hermes profile create product --description "Writes product specs and acceptance criteria from user research."
hermes profile create builder --description "Implements API and UI in the assigned worktree; runs tests."
hermes profile create qa --description "Tests, security-reviews, and reports findings with evidence."
hermes -p product setup
hermes -p builder setup
hermes -p qa setup
```

Install an identity file for each profile from [`SOUL.specialist.md`](templates/SOUL.specialist.md), filling in the role placeholders. Then turn on memory review:

```bash
cp ~/Downloads/SOUL.specialist.product.md ~/.hermes/profiles/product/SOUL.md
hermes -p product config set memory.write_approval true
```

Limit tools per role. Workers inherit the profile's `cli` toolsets:

```bash
hermes -p product tools disable browser computer_use code_execution image_gen cronjob
hermes -p qa tools disable computer_use image_gen cronjob
hermes -p builder tools disable computer_use image_gen cronjob
```

Merge [`specialist-profile.overlay.yaml`](templates/specialist-profile.overlay.yaml) into each profile. It denies `git push`, force pushes and hard resets. Workers run headless, and one-shot runs deny dangerous commands by default (`approvals.single_query_mode: deny`). Treat both as guardrails, not a sandbox. For stronger isolation, give the profile a container terminal backend.

## Step 4 — Board, dispatcher and orchestrator permissions

```bash
hermes kanban init
hermes kanban boards create feedback-mvp --name "Feedback triage MVP" --description "Pilot sprint" --default-workdir /ABSOLUTE/PATH/startup-hq --switch
hermes gateway status
hermes kanban --board feedback-mvp dispatch --dry-run
hermes -p jarvis tools enable kanban
hermes -p jarvis tools enable kanban --platform telegram
```

The dispatcher runs inside the host gateway, started from the default profile. `hermes kanban daemon` is deprecated. The board's `--default-workdir` is a git repo, so new tasks default to a preserved worktree at `<repo>/.worktrees/<task-id>`. Apply [`kanban-host.overlay.yaml`](templates/kanban-host.overlay.yaml) to the profile that hosts the dispatcher. It sets:

- `kanban.auto_decompose: false`, so nothing fans out without you
- `max_in_progress: 2`
- `failure_limit: 2`

## Step 5 — Pilot sprint

Put each card body in `contracts/NN-*.md`, copied from [`TASK-CONTRACTS.md`](templates/TASK-CONTRACTS.md). Note each printed task id and substitute it for the `<T_...>` placeholders:

```bash
hermes kanban --board feedback-mvp create "Spec: feedback triage MVP" --assignee product --body-file /ABSOLUTE/PATH/startup-hq/contracts/01-spec.md --max-runtime 45m --max-retries 2
hermes kanban --board feedback-mvp create "Build: CSV ingest, tagging, list, export" --assignee builder --parent <T_SPEC> --body-file /ABSOLUTE/PATH/startup-hq/contracts/05-build.md --max-runtime 2h --max-retries 2
hermes kanban --board feedback-mvp create "QA + security review" --assignee qa --parent <T_BUILD> --body-file /ABSOLUTE/PATH/startup-hq/contracts/07-qa.md --max-runtime 1h
hermes kanban --board feedback-mvp create "JARVIS sprint summary" --assignee jarvis --parent <T_QA> --body-file /ABSOLUTE/PATH/startup-hq/contracts/08-summary.md --max-runtime 30m
```

A card whose parents are open waits in `todo`. The dispatcher promotes it once every parent is `done`. Watch progress with `hermes kanban --board feedback-mvp watch` or the dashboard's Kanban tab (`hermes dashboard`).

## Step 6 — Scale to the full team

Create `architect`, `design`, `frontend`, `backend` and `growth` the same way as in Step 3. Then build this graph:

```text
T1 spec (product)
 ├─> T2 design (design) ────────────┐
 ├─> T3 API contract (architect) ─┬─> T5 frontend (frontend) ─┐
 │                                └─> T4 backend (backend) ───┴─> T6 integrate (architect) ─> T7 QA/security (qa) ─┐
 └─> T9 launch drafts (growth, no publishing) ───────────────────────────────────────────────────────────────────────┴─> T8 JARVIS summary (jarvis)
```

`T5` takes two parents (`--parent <T2> --parent <T3>`). `T8` takes `--parent <T7> --parent <T9>`. If you realise a missing edge after creating the cards, add it with `hermes kanban --board feedback-mvp link <PARENT> <CHILD>`. Never link a support card under the card it is meant to unblock, because that deadlocks both.

### Orchestrator alternative

Instead of typing CLI commands, paste [`ORCHESTRATOR-PROMPT.md`](templates/ORCHESTRATOR-PROMPT.md) into a JARVIS chat. JARVIS then creates the same graph with `kanban_create` / `kanban_link` tool calls. A chat on the gateway is automatically subscribed to completion and block events for the cards it creates. The starter prompt:

```text
You are orchestrating board feedback-mvp for startup-hq context-v1.0.0.
Read MISSION.md and TEAM.md in /ABSOLUTE/PATH/startup-hq. Run kanban_list first.
Only assign to profiles that exist: product, design, architect, frontend, backend, qa, growth, jarvis.
Create cards T1..T9 exactly as in TASK-CONTRACTS.md with the listed parents. Stamp every
shared decision (data schema, tag set, API shape) into each card body that depends on it.
Do not implement anything yourself. Do not unblock human-gated cards. Report the card ids.
```

## Handoff contract

Every worker ends with `kanban_complete(summary=..., metadata=...)`. The summary and metadata of each parent appear automatically in a child task's context. Required metadata:

```json
{
  "context_version": "context-v1.0.0",
  "branch": "wt/<task-id>",
  "commit": "<sha>",
  "artifacts": ["docs/api/feedback-api.md"],
  "verification": ["npm test -> 14 passed"],
  "decisions": ["tags: bug|feature|praise|other"],
  "residual_risk": ["no auth; local-only"],
  "blocked_reason": null
}
```

A downstream worker reads upstream artifacts with `git show wt/<parent-id>:<path>`. If it needs the code, it merges the parent's branch into its own branch. It never edits files owned by another role.

## Ownership and integration

- Each task writes only in its own worktree, on branch `wt/<task-id>`.
- `architect` owns T6 integration. It merges the T4 and T5 branches into its own worktree, runs the full test suite and records the merge commit.
- **You** merge the integration branch into `main` and push. Workers never push.
- If branches conflict, create a reconciliation card for a neutral profile with both cards as parents. The bundled `agent-merge-conflict-arbiter` skill is designed for this (`--skill agent-merge-conflict-arbiter`, if it is installed on that profile).

## Shared knowledge and memory governance

These rules follow [`MEMORY-POLICY.md`](templates/MEMORY-POLICY.md) (recommendation):

- **Single writer.** Only you commit changes to MISSION, TEAM and DECISIONS. JARVIS proposes changes as a comment or a card; you approve them and bump `context_version`.
- **Private memory stays private.** Specialists run with `memory.write_approval: true`. Approve only durable role lessons, never project facts, which belong in the repo.
- **Stale or conflicting information.** Every entry in DECISIONS.md carries a date, owner and source task id. Newer approved entries replace older ones. A worker that finds a conflict blocks with `needs_input` and cites both sources.
- **Optional provider.** An external memory provider (for example, Supermemory `container_tag: hermes-{identity}` per profile, plus a read-mostly shared container) adds semantic recall. Hermes does not enforce per-profile ACLs on shared containers, so the provider's credentials and your policy must.

## Reporting to JARVIS

Reports go through the board, not chat messages between agents. T8 runs as a JARVIS worker and reads every parent's handoff. It completes with:

- a DoD checklist
- an evidence table
- unverified claims
- decisions it needs from you

To send those results to your phone:

```bash
hermes kanban notify-subscribe <T_SUMMARY> --platform telegram --chat-id <YOUR_CHAT_ID> --notifier-profile jarvis --delivery-mode notify+wake
```

A worker's summary is a claim, not verified evidence. Acceptance (below) requires you to re-run the evidence yourself.

## Failure, deadline, budget and retry controls

| Control | Mechanism |
|---|---|
| Per-card wall clock | `--max-runtime 2h` (the worker is terminated and the card requeued) |
| Retries | `--max-retries N`, `kanban.failure_limit` (auto-block after N consecutive failures) |
| Concurrency | `kanban.max_in_progress`, `kanban.max_in_progress_per_profile` |
| Model cost | Cheap models for worker profiles; `--model/--provider` for the rare hard card; `hermes kanban set-model <id> none` to clear |
| Spend review | `hermes -p <profile> insights --days 1` for each profile |
| Deadline | `MISSION.md` date; JARVIS summary flags cards still open |
| Stop everything | `hermes pause --reason "..."` / `hermes resume` |

## Human decision gates

These actions require you in person: merging to `main`, pushing, deploying, public launch or posts, emails to customers, spending money, adding credentials, and changing MISSION or DoD. Growth produces drafts only. The launch itself is never a card that an agent can complete.

## Failure recovery walkthrough

```bash
hermes kanban --board feedback-mvp diagnostics
hermes kanban --board feedback-mvp show <ID>
hermes kanban --board feedback-mvp runs <ID>
hermes kanban --board feedback-mvp log <ID> --tail 4000
```

| Situation | Action |
|---|---|
| `blocked` needing input | `hermes kanban --board feedback-mvp comment <ID> "Use tag set v2 from DECISIONS.md"` then `unblock <ID> --reason "answered"` |
| Wrong assignee or stuck worker | `reassign <ID> <PROFILE> --reclaim --reason "..."` |
| Provider credential error (`gave_up`) | Fix with `hermes -p <PROFILE> auth` or `setup`, then `unblock <ID>` |
| Done card fails later | New child card with `--parent <DONE_ID>` and the new evidence in the body; do not reopen |
| Dependency deadlock | `unlink <PARENT> <CHILD>` |

## Acceptance walkthrough

The sprint is accepted only after you have seen real output yourself:

1. `hermes kanban --board feedback-mvp list` shows T1–T9 as `done`.
2. `hermes kanban --board feedback-mvp show <T6>` names a merge commit. `git -C /ABSOLUTE/PATH/startup-hq log --oneline <that-sha> -3` confirms the commit exists.
3. Check out the integration branch and run the tests yourself. The pass count must match the handoff.
4. Import `samples/feedback.csv`, check the tags against the rules in DECISIONS.md, and export a file.
5. Read `docs/qa/report.md`. It must list zero open high-severity findings.
6. Read T8's summary. Every claim should link to a handoff, and every "unverified" item needs your decision.
7. Only then merge to `main`. Launch is a separate decision you make yourself.

### Sources

- https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
- https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial
- https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-worker-lanes
- https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-multi-gateway
- https://hermes-agent.nousresearch.com/docs/user-guide/profiles
- https://hermes-agent.nousresearch.com/docs/user-guide/multi-profile-gateways
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers
- https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
- https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
- https://hermes-agent.nousresearch.com/docs/user-guide/security
- https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference
- CLI help and source (hermes_cli/kanban_db_dispatch.py, kanban_db_workspace.py) at upstream f42f579, see docs/advanced-verification.md

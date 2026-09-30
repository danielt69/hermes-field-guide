# AGENTS.md — startup-hq (template; save as AGENTS.md at the repo root)
# Hermes workers load this because their working directory is the task worktree inside this repo.

## Read first
1. MISSION.md — objective, definition of done, gates, context_version.
2. TEAM.md — roles, owned paths, integrator.
3. DECISIONS.md — dated, approved decisions. Newest approved entry wins.

## Source of truth
- Committed files on `main` at tag `<CONTEXT_TAG>` (e.g. context-v1.0.0).
- Upstream task output: read it via the parent handoff in kanban_show, and files via
  `git show wt/<parent-task-id>:<path>`.
- Card bodies must not override MISSION.md. On conflict: kanban_block kind=needs_input.

## Ownership
- Write only in the paths TEAM.md assigns to your role.
- One task = one worktree = one branch `wt/<task-id>`. Commit locally; never push.
- Only the integrator role merges other branches, in its own integration task.

## Commands (fill in)
- Install: `<INSTALL_COMMAND>`
- Test: `<TEST_COMMAND>`
- Run locally: `<RUN_COMMAND>`

## Handoff
- Finish with kanban_complete using the metadata shape in HANDOFF.md.
- Verification entries must be commands you actually ran, with their real result.

## Never
- Push, deploy, publish, email, spend, or change credentials.
- Read or print .env or secrets.
- Edit MISSION.md, TEAM.md, or DECISIONS.md (propose changes in a card comment instead).

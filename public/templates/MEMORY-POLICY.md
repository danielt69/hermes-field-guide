# MEMORY-POLICY.md (template)

Hermes facts this policy relies on:
- Each profile has its own MEMORY.md (2,200 chars) and USER.md (1,375 chars), loaded as a frozen
  snapshot at session start. Profiles do not share memory.
- memory.write_approval: true stages non-interactive writes for /memory pending|approve|reject.
- Only one external memory provider can be active per profile; it syncs turns to that provider.

## Layers and owners
| Layer                         | Holds                                   | Writer                 | Approval             |
|-------------------------------|-----------------------------------------|------------------------|----------------------|
| Profile MEMORY.md / USER.md   | Durable personal/role lessons           | that profile's agent   | <YOUR_NAME> reviews  |
| Repo MISSION/TEAM/DECISIONS   | Shared project truth                    | <YOUR_NAME> only       | commit + tag         |
| Repo docs/, app/              | Work products                           | owning role (TEAM.md)  | integrator + tests   |
| Kanban comments + handoffs    | Task-level context and evidence         | workers, JARVIS, you   | durable log          |
| External provider (optional)  | Semantic recall                         | per provider config    | see provider docs    |

## Rules
1. Single writer for shared truth. Agents propose; <YOUR_NAME> commits and bumps context_version.
2. Every DECISIONS.md entry: date, decision, owner, source task id, supersedes (if any).
3. Conflict or staleness: newest approved entry wins; a worker that detects a conflict blocks with needs_input.
4. Never store secrets, credentials, customer PII, or raw logs in any memory layer.
5. Never symlink or copy MEMORY.md, USER.md, state.db, auth.json, or .env between profiles.
6. Weekly: review each profile's memory (`cat ~/.hermes/profiles/<p>/memories/MEMORY.md`,
   `hermes -p <p> journey list`) and remove stale entries.
7. Optional provider namespaces: one namespace per profile (e.g. Supermemory container_tag
   "hermes-{identity}") plus at most one shared, read-mostly namespace. Hermes does not enforce
   access control between namespaces; restrict with provider credentials.

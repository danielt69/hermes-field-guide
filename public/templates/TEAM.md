# TEAM.md (template)

Board: <BOARD_SLUG>   Repo: <ABSOLUTE_REPO_PATH>   Context: <CONTEXT_TAG>
Integrator: architect (pilot: builder)   Merges to main / pushes: <YOUR_NAME> only

| Profile   | Role                        | Owns (write)                  | Reads                     | Tool policy (recommended)           |
|-----------|-----------------------------|-------------------------------|---------------------------|-------------------------------------|
| jarvis    | Orchestrator, reports       | board cards, final summary    | everything                | kanban enabled; no implementation   |
| product   | Spec + user research        | docs/spec/                    | MISSION, DECISIONS        | file, web                           |
| design    | UX flows, copy              | docs/design/                  | docs/spec/                | file, web                           |
| architect | API contract, integration   | docs/api/, integration branch | docs/spec/, docs/design/  | file, terminal                      |
| frontend  | UI                          | app/web/                      | docs/design/, docs/api/   | file, terminal                      |
| backend   | API + data                  | app/api/                      | docs/api/                 | file, terminal                      |
| qa        | Tests + security review     | tests/, docs/qa/              | everything                | file, terminal, web                 |
| growth    | Launch drafts only          | docs/launch/                  | docs/spec/                | file, web; never publishes          |

Pilot (smaller): jarvis, product, builder (architect+frontend+backend), qa.

## Escalation
- Needs a decision -> kanban_block kind=needs_input (JARVIS relays to <YOUR_NAME>).
- Conflicting sources -> block and cite both.
- Colliding branches -> reconciliation card for a neutral profile with both cards as parents.

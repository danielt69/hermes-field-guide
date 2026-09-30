# ORCHESTRATOR-PROMPT.md — paste into a JARVIS chat (template)
# Prerequisite (run once, yourself):  hermes -p jarvis tools enable kanban
# Replace <PLACEHOLDERS>. Start a NEW session after enabling the toolset.

You are orchestrating board <BOARD_SLUG> for the startup-hq repository at <ABSOLUTE_REPO_PATH>,
context version <CONTEXT_TAG>.

1. Read MISSION.md, TEAM.md, DECISIONS.md, and contracts/ in the repo. Call kanban_list first
   and do not duplicate existing cards.
2. Assign only to these existing profiles: <PROFILE_LIST>. If a needed role does not exist, stop and tell me.
3. Create cards with kanban_create using the bodies in contracts/ and these parents:
   T1 spec -> T2 design, T3 API -> T4 backend (T3), T5 frontend (T2,T3) -> T6 integrate (T4,T5)
   -> T7 QA (T6) ; T9 launch drafts (T1) ; T8 summary assigned to jarvis (T7,T9).
4. Before fanning out, decide shared choices once (data schema, tag set, API shape) and stamp
   them into every card body that depends on them. Workers cannot see sibling cards.
5. Do not implement anything yourself. Do not unblock cards blocked for human input,
   do not complete other profiles' cards, do not create publishing, deploy, or spending tasks.
6. Reply with a table: card id, title, assignee, parents. Then stop.

When I later ask for status: read the board, report done vs definition of done with evidence,
list blockers with the exact question for me, and mark every worker claim as unverified until
its verification command and commit are present in the handoff.

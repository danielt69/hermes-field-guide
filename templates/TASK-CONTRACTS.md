# TASK-CONTRACTS.md — sample card bodies for the feedback-triage sprint
# Save each section as its own file under contracts/ and pass it with:
#   hermes kanban --board <BOARD> create "<TITLE>" --assignee <PROFILE> --parent <ID> --body-file contracts/<FILE>.md
# <T_...> are placeholders for real task ids printed by `hermes kanban create`.

## contracts/01-spec.md  (assignee: product, no parents)
Goal: Write docs/spec/feedback-mvp.md for the MISSION.md objective (context-v1.0.0).
Include: user stories, the tag set (bug|feature|praise|other) with a deterministic keyword rule per tag,
CSV columns (id,text,created_at), acceptance criteria mirroring the definition of done.
Also create samples/feedback.csv with 20 synthetic rows (no real customer data).
Done when: both files are committed on wt/<task-id>; metadata lists them.
Stop and block (needs_input) if the objective is ambiguous.

## contracts/02-design.md  (assignee: design, parent: T1)
Goal: docs/design/flows.md — import, list-by-tag, export screens; empty/error states; UI copy.
Input: parent spec (read via `git show wt/<T1>:docs/spec/feedback-mvp.md`).
Done when: committed; metadata lists decisions that frontend must follow.

## contracts/03-api.md  (assignee: architect, parent: T1)
Goal: docs/api/feedback-api.md — endpoints POST /import, GET /items?tag=, GET /export; JSON shapes;
the tagging function signature. This contract is binding for T4 and T5.
Done when: committed; decisions recorded in metadata.

## contracts/04-backend.md  (assignee: backend, parent: T3)
Goal: implement app/api/ per docs/api/feedback-api.md (merge wt/<T3> into your branch first).
Verify: <TEST_COMMAND> for app/api passes; include the real pass count.
Never push. Block if the contract is unimplementable as written.

## contracts/05-frontend.md  (assignee: frontend, parents: T2, T3)
Goal: implement app/web/ per design flows and API contract (merge wt/<T2> and wt/<T3> first).
Verify: <TEST_COMMAND> for app/web passes; screenshot or description of each screen state.

## contracts/05-build.md  (PILOT ONLY — assignee: builder, parent: T_SPEC)
Goal: implement API + UI in app/ per the spec in one worktree. Verify with <TEST_COMMAND>.

## contracts/06-integrate.md  (assignee: architect, parents: T4, T5)
Goal: in your worktree merge wt/<T4> and wt/<T5>, resolve conflicts only in integration glue,
run the full <TEST_COMMAND>, run the app against samples/feedback.csv.
Done when: metadata has merge commit sha and full test result. Do not push or merge to main.

## contracts/07-qa.md  (assignee: qa, parent: T6 (pilot: T_BUILD))
Goal: docs/qa/report.md — test each definition-of-done item against the integration branch,
basic security review (input handling of CSV, path handling on export, dependency audit output),
severity per finding (high/medium/low), reproduction steps.
Done when: report committed; metadata lists open high-severity count (must be real, may be > 0).

## contracts/09-launch-drafts.md  (assignee: growth, parent: T1)
Goal: docs/launch/drafts.md — announcement draft, FAQ, feedback survey text. DRAFTS ONLY.
Never post, email, schedule, or contact anyone.

## contracts/08-summary.md  (assignee: jarvis, parents: T7 (+T9 in full team))
Goal: sprint report for <YOUR_NAME> as the completion summary:
1) definition-of-done checklist, each item marked verified-by-handoff / unverified;
2) evidence table (task, branch, commit, verification command, result);
3) open risks and QA findings; 4) cost/deadline status; 5) decisions needed from <YOUR_NAME>
(merge, launch). Read every parent via kanban_show; do not rerun or change code.

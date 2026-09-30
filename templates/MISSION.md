# MISSION.md (template)

context_version: context-v1.0.0
owner (single writer): <YOUR_NAME>
last_updated: <YYYY-MM-DD>

## Objective
<One sentence. Example: Ship a local MVP that triages customer feedback from a CSV.>

## Users
<Who, and the job they need done.>

## Definition of done (all must be true, with evidence)
- [ ] <Functional outcome 1, e.g. imports samples/feedback.csv>
- [ ] <Functional outcome 2, e.g. tags each row bug|feature|praise|other per DECISIONS.md rules>
- [ ] <Quality gate, e.g. `npm test` passes>
- [ ] <QA gate, e.g. docs/qa/report.md has zero open high-severity findings>
- [ ] Nothing deployed, published, or sent externally.

## Non-goals
- <e.g. authentication, hosting, integrations with real customer systems>

## Constraints
- Budget: <e.g. max $<N> model spend for the sprint; check with `hermes -p <profile> insights --days 1`>
- Deadline: <YYYY-MM-DD>
- Data: <e.g. synthetic sample data only; no real customer PII>

## Human decision gates (agents must stop and ask)
- Merge to main, push, deploy, public launch/posts, customer email, spending, credentials,
  and any change to this file or the definition of done.

## Change log
- context-v1.0.0 — initial mission (<YYYY-MM-DD>)

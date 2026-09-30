# HANDOFF.md — task completion contract (template)

Every worker ends its run with ONE of:
- kanban_complete(summary=..., metadata=...)   — work done and verified
- kanban_request_review(summary=..., metadata=...) — same-card review wanted
- kanban_block(reason=..., kind=needs_input|capability|transient|dependency)

## Summary (human-readable, 3-6 lines)
What was produced, where it lives, how it was verified, what is left open.

## Metadata (machine-readable; downstream cards see it via the parent link)
{
  "context_version": "<CONTEXT_TAG>",
  "branch": "wt/<task-id>",
  "commit": "<git sha from `git rev-parse HEAD`>",
  "artifacts": ["<repo-relative path>", "..."],
  "verification": ["<exact command> -> <observed result>"],
  "decisions": ["<decision made or applied, with DECISIONS.md reference>"],
  "dependencies": ["<parent task ids used>"],
  "residual_risk": ["<not tested / assumptions>"],
  "blocked_reason": null
}

## Rules
- Only list commands you actually ran. "Should pass" is not verification.
- Paths must exist on the named branch; reviewers check with `git show <branch>:<path>`.
- No secrets, tokens, customer PII, or raw multi-KB logs. Store pointers instead.
- Summaries from subagents (delegate_task) are unverified until you re-check them.

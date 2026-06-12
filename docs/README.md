# Flashtotype Docs

Start here:

- `BOOTSTRAP.md`: how agents install Flashtotype into another project.
- `EVIDENCE_POLICY.md`: how claims, sources, assumptions, and validation gaps are handled.
- `OUTPUT_CONTRACT.md`: the expected artifacts and static HTML data shape.
- `PROJECT_STRUCTURE.md`: which folders are agent-owned, user-editable, and generated.
- `USER_JOURNEY.md`: how a user starts from zero and gets to research, prototype, and presentation.

Flashtotype is intentionally lightweight. V1 is a portable agent workflow plus templates, not a SaaS app.

The installing agent must begin onboarding in the same conversation without requiring a restart. Reopened projects expose `$flash-onboard`, `$flash-revise`, `$flash-present`, `$flash-research`, and `$flash-review` from `.agents/skills/`, with `flashtotype-workspace/current/START-HERE.md` as the durable fallback.

# Documentation Policy

Flashtotype is intended to be public by default.

## Public-Safe Content

These locations may be committed:

- `README.md`
- `AGENTS.md`
- `DOCS_POLICY.md`
- `DEPLOY.md`
- `docs/`
- `agent/`
- `user-workspace-template/`
- `scripts/`

Keep these files free of secrets, private customer details, personal account notes, confidential product strategy, and generated user research.

## Private Generated Content

Generated PM/PO work belongs in:

- `flashtotype-workspace/`
- `docs-internal/` only for short-lived local scratch notes.

Both are gitignored in this repository. Users can promote sanitized outputs into tracked docs when they are ready to share them.

## Long-Term Internal Planning

Long-term maintainer planning should live outside this public repo in the private `flashtotype-internal` repository. Use that private repo for roadmap tracking, task boards, decision logs, private research notes, release checklists, and agent handoffs.

Do not rely on gitignored local folders for important long-term history because they are easy to lose and are not backed up by GitHub.

## Installed Project Boundaries

In a project that has installed Flashtotype:

- `.flashtotype/` is agent-owned. Users should not edit it during normal PM/PO work.
- `flashtotype-workspace/current/user-editable/` is where users and agents should edit briefs, evidence, journey notes, prototypes, design system notes, source references, CSV files, and assets.
- `flashtotype-workspace/current/output/` is generated output. Users should open it to view the board, but should edit source files instead of hand-editing generated HTML.

## Evidence Handling

Do not store credentials, paid report contents, private customer interviews, or confidential source material in public templates. Store only source metadata and short summaries unless the user has permission to share more.

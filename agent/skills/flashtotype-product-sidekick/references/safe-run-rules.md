# Safe Run Rules

Use these rules whenever creating or editing Flashtotype artifacts.

## Continuation Check

Before editing, inspect the current run:

- `flashtotype-workspace/current/user-editable/flashtotype-brief.md`
- `flashtotype-workspace/current/user-editable/evidence.json`
- `flashtotype-workspace/current/user-editable/decision-pack.md`
- `flashtotype-workspace/current/user-editable/user-journey.md`
- `flashtotype-workspace/current/user-editable/prototype.md`
- `flashtotype-workspace/current/user-editable/Design.md`
- `flashtotype-workspace/current/user-editable/flashtotype-library.md`
- `flashtotype-workspace/current/user-editable/references/`
- `flashtotype-workspace/current/user-editable/data/`
- `flashtotype-workspace/current/user-editable/assets/`
- `flashtotype-workspace/current/output/index.html`

If the target project has private handoff docs, read the active handoff first. Prefer one current handoff over broad history scanning. Do not read old history files unless the current state is unclear.

## Artifact Impact Map

Before changing artifacts, write a compact impact map for yourself:

- Scope: what product decision or artifact is changing.
- Surfaces: brief, evidence ledger, decision pack, HTML, project `AGENTS.md`, or templates.
- Claims: which source-backed claims, assumptions, or validation gaps are affected.
- Invariants: privacy boundary, claim labels, cited sources, recommendation confidence, HTML rendering.
- Verification: the smallest useful checks for this run.

## Iteration Cycle

Work in short cycles:

1. Discover: gather only the user answers, repo context, and sources needed for the next artifact update.
2. Draft: update one coherent artifact set at a time.
3. Verify: check claim labels, evidence links, JSON validity, and HTML data shape.
4. Summarize: record changed files, confidence, and residual risk.

If the product thesis or evidence is still unclear after the first pass, state the uncertainty and ask targeted follow-up questions before inventing detail.

## Checkpoint Rule

Before overwriting meaningful existing artifacts:

- If the target project is in git and the user allows commits, create a selective checkpoint commit for the existing Flashtotype artifacts.
- If commits are not appropriate, copy the existing artifacts to `flashtotype-workspace/.checkpoints/<timestamp>/`.
- Do not store private checkpoint material in public docs, source folders, generated output, or `.flashtotype/`.

Never revert unrelated user work. Restore only the files or sections from the Flashtotype checkpoint when asked.

## Claim Safety

- Never upgrade a claim to `Source-backed` without a matching source record.
- Never remove a validation gap just because it weakens the recommendation.
- Treat legal, medical, financial, privacy, security, and compliance claims as `Needs validation` unless backed by authoritative sources.
- If browsing is unavailable, keep external claims as `Assumption` or `Needs validation`.

## Flashtotype Regression Watchlist

Check these before final handoff:

- `evidence.json` is valid JSON.
- Every important market, user, product, or tech claim has one of the three allowed labels.
- `Source-backed` claims have source IDs and source records.
- Private generated research remains under `flashtotype-workspace/`.
- `decision-pack.md` matches the recommendation and evidence in `flashtotype-brief.md`.
- `output/index.html` contains valid embedded JSON in the `flashtotype-data` script tag.
- Embedded board data includes `home`, `journey`, `prototype`, `design`, and `library` pages.
- The static HTML opens without a server and does not require network dependencies.
- Text remains readable on mobile and desktop widths.

## Structure Maintenance Trigger

If changing artifact structure, JSON shape, claim labels, or HTML data fields, update the relevant contract in the same cycle:

- `.flashtotype/skills/flashtotype-product-sidekick/references/output-contract.md` in installed projects.
- `docs/OUTPUT_CONTRACT.md` and template files when changing the Flashtotype source repo.

Report stale docs as residual risk if they cannot be updated.

## Context Budget

Keep the first pass focused:

- Read the active user-editable brief, evidence ledger, decision pack, and current generated HTML before expanding scope.
- Use scoped searches instead of broad dumps.
- Load only the reference file needed for the current decision.
- Expand only for unclear product intent, conflicting evidence, broken JSON, or failed HTML verification.

## Final Handoff

End with:

- Changed files.
- Recommendation and confidence.
- Evidence count by label.
- Assumptions and validation gaps.
- Verification run and skipped checks.
- Path to `flashtotype-workspace/current/output/index.html`.

---
name: flash-review
description: Audit an existing Flashtotype decision pack and static board for sharing readiness without editing by default. Use before stakeholder review, team handoff, a decision meeting, or publication to find unsupported claims, contradictory artifacts, missing evidence, weak recommendations, incomplete pages, and output-contract failures.
---

# Flash Review

Perform an evidence and artifact quality gate. Report findings first and keep the review read-only unless the user explicitly asks for fixes.

## Workflow

1. Find the repository root and verify these paths exist:
   - `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md`
   - `flashtotype-workspace/current/user-editable/`
   - `flashtotype-workspace/current/output/index.html`
2. If the paths are missing, report that onboarding or generation is incomplete.
3. Read the product-sidekick skill plus `references/evidence-rules.md`, `references/output-contract.md`, and `references/safe-run-rules.md`.
4. Inspect the brief, evidence ledger, decision pack, journey, prototype, design, presentation, library, generated HTML, and local output assets.
5. Verify:
   - Every important claim has an allowed evidence label.
   - Every `Source-backed` claim maps to valid source records.
   - Recommendation, confidence, risks, and next actions agree across artifacts.
   - Important contrary evidence and validation gaps remain visible.
   - Required artifacts and all six board pages exist.
   - Embedded board JSON is valid and presentation asset paths are local.
   - The pack states a clear user, painful workflow, decision, success signal, and next validation step.
6. Do not edit files by default. If the user explicitly asks to fix findings, apply only approved fixes through `$flash-revise`, `$flash-research`, or `$flash-present` as appropriate.
7. Report findings ordered by severity with file references, then give:
   - Sharing recommendation: `Ready`, `Ready with caveats`, or `Not ready`.
   - Confidence.
   - Evidence count by label.
   - Top assumptions and validation gaps.
   - Exact next actions and the command best suited to each action.

Do not mistake polished presentation output for decision quality.

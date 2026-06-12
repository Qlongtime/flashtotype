---
name: flash-revise
description: Revise an existing Flashtotype decision pack and static board from a user's requested product, research, persona, workflow, prototype, design, risk, or presentation change. Use when the project already has Flashtotype artifacts and they must be updated without losing evidence, uncertainty, or unrelated user work.
---

# Flash Revise

Apply the requested change to the canonical Flashtotype sources, propagate its impact through dependent artifacts, and regenerate the static board.

## Workflow

1. Find the repository root and verify these paths exist:
   - `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md`
   - `flashtotype-workspace/current/user-editable/`
   - `flashtotype-workspace/current/output/index.html`
2. If the paths are missing, stop and report that Flashtotype installation or onboarding is incomplete.
3. Treat the user's surrounding prompt as the revision request. Ask a question only when ambiguity would materially change the decision or overwrite the wrong artifact.
4. Read `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` and its `references/safe-run-rules.md` completely.
5. Inspect the current brief, evidence ledger, decision pack, affected source files, and output HTML.
6. Create the compact impact map required by the safe-run rules. Identify affected claims, dependencies, invariants, and verification.
7. Read `references/evidence-rules.md` before changing claims and `references/output-contract.md` before changing board data.
8. Update the smallest coherent set of canonical files under `flashtotype-workspace/current/user-editable/`.
9. Preserve unrelated content. Never mark a claim `Source-backed` without a matching source record, and never remove a validation gap only because it weakens the recommendation.
10. Regenerate `flashtotype-workspace/current/output/index.html` when source content changed. Keep `flashtotype.js` generic unless the template behavior itself must change.
11. Validate `evidence.json`, embedded board JSON, required page IDs, and local presentation asset paths.
12. End with changed files, recommendation and confidence, evidence counts, assumptions and validation gaps, verification performed, next actions, and the HTML path.

Do not reinterpret a narrow revision as permission to rewrite the full product strategy.

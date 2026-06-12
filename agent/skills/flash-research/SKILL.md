---
name: flash-research
description: Run a focused evidence-gathering pass for an existing Flashtotype project and update the source ledger and affected decision artifacts. Use for competitor scans, substitutes, pricing signals, market evidence, user-workflow evidence, technical feasibility, integration research, or compliance and privacy research.
---

# Flash Research

Answer a bounded product question with traceable sources, then propagate only the evidence-backed impact through the Flashtotype decision pack.

## Workflow

1. Find the repository root and verify these paths exist:
   - `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md`
   - `flashtotype-workspace/current/user-editable/evidence.json`
   - `flashtotype-workspace/current/user-editable/flashtotype-brief.md`
2. If the paths are missing, report that onboarding or installation is incomplete.
3. Treat the user's surrounding prompt as the research question. If no research focus is provided, ask for one rather than running a broad market scan.
4. Read the product-sidekick skill plus `references/safe-run-rules.md` and `references/evidence-rules.md`.
5. Inspect the current recommendation, relevant claims, existing sources, assumptions, and validation gaps before researching.
6. Define a compact research scope:
   - Decision the research should inform.
   - Claims or gaps to test.
   - Source types needed.
   - Explicit exclusions.
7. Use current, relevant sources when external research is available. Prefer primary or authoritative sources for technical, legal, privacy, security, medical, or financial claims.
8. Never invent citations. Add complete source records and connect each `Source-backed` claim to matching source IDs.
9. Update `evidence.json` first, then update only the affected brief, decision pack, journey, prototype, design, presentation, or library sections.
10. Preserve contrary evidence and visible uncertainty. Do not force the research to support the current recommendation.
11. Read `references/output-contract.md` and regenerate the static board when source artifacts changed.
12. End with the research question, sources added, claims added or changed, recommendation impact, evidence counts, unresolved gaps, and HTML path.

Do not turn a focused research request into a full onboarding interview or unrelated artifact rewrite.

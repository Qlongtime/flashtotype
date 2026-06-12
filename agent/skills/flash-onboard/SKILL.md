---
name: flash-onboard
description: Start or resume the guided Flashtotype product discovery workflow in an installed project. Use when the user wants to onboard a product idea, begin a decision pack, continue an incomplete Flashtotype interview, or regenerate the first complete PM/PO artifact set.
---

# Flash Onboard

Start from the installed Flashtotype kit, gather only the missing product context, and then run the full evidence-labeled decision-pack workflow.

## Workflow

1. Find the repository root and verify these paths exist:
   - `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md`
   - `flashtotype-workspace/current/user-editable/`
   - `flashtotype-workspace/current/output/`
2. If the paths are missing, stop and report that Flashtotype installation is incomplete. Do not invent a replacement layout.
3. Read `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` completely and follow it as the primary workflow.
4. Read its `references/safe-run-rules.md` and `references/interview-flow.md` before changing artifacts.
5. Inspect the current brief, evidence ledger, decision pack, and output HTML when present.
6. If useful content already exists, summarize the current thesis and ask only for missing or contradictory information. Do not restart the interview from zero.
7. If the workspace is blank, use the staged interview in `references/interview-flow.md`. Ask no more than four concise questions in the opening turn, then ask only material follow-ups.
8. Do not generate final artifacts until the required discovery fields are clear or explicitly labeled as assumptions.
9. Complete the product-sidekick workflow, including evidence labels, source ledger updates, all user-editable artifacts, and the static HTML board.
10. End with the completion checklist required by the product-sidekick skill.

Do not require a Codex restart or a refreshed skill selector. If this file was read directly during installation, begin the interview in the same conversation. Treat the user's surrounding prompt as additional onboarding context. Preserve existing user work and never downgrade visible uncertainty to make the recommendation look stronger.

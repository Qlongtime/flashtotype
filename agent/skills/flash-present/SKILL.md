---
name: flash-present
description: Create or refresh a stakeholder presentation from an existing Flashtotype decision pack. Use when the user asks for slides, a deck, a pitch, an executive readout, presentation mode, speaker notes, or a stakeholder story based on current Flashtotype artifacts.
---

# Flash Present

Build the presentation through the installed Flashtotype presentation engine while preserving its evidence and static-output contracts.

## Workflow

1. Find the repository root and verify these paths exist:
   - `.flashtotype/skills/flashtotype-presentation-generator/SKILL.md`
   - `flashtotype-workspace/current/user-editable/`
   - `flashtotype-workspace/current/output/`
2. If the presentation engine is missing, report that the Flashtotype installation is incomplete.
3. Treat the user's surrounding prompt as the audience, decision, length, tone, or presentation revision request.
4. Read `.flashtotype/skills/flashtotype-presentation-generator/SKILL.md` completely and follow it as the primary workflow.
5. Use the existing brief, decision pack, evidence ledger, journey, prototype, design, and library sources. Do not invent product claims or presentation facts.
6. Ask a question only when the target audience or decision cannot be inferred and would materially change the story.
7. Create or update `presentation.md`, presentation page data, speaker notes, visual prompts, and local assets according to the presentation engine.
8. End with the presentation source path, HTML path, slide and image counts, evidence counts, assumptions, validation gaps, and next actions.

Do not make an external slide tool, account, API, backend, or build step mandatory.

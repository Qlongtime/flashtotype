# Flashtotype Library

Use this file as the source for the `Flashtotype library` board page.

## Installed Skills And Workflow Modules

| Name | Type | Path | Used For | Status |
| --- | --- | --- | --- | --- |
| flash-onboard | Project command skill | `.agents/skills/flash-onboard/SKILL.md` | Project onboarding, discovery interview, first decision pack, resume incomplete runs | Active |
| flash-revise | Project command skill | `.agents/skills/flash-revise/SKILL.md` | Focused artifact revision, evidence-safe updates, board regeneration | Active |
| flash-present | Project command skill | `.agents/skills/flash-present/SKILL.md` | Stakeholder presentations, speaker notes, local slide visuals, presentation mode | Active |
| flash-research | Project command skill | `.agents/skills/flash-research/SKILL.md` | Competitor, market, pricing, workflow, feasibility, and risk evidence | Active |
| flash-review | Project command skill | `.agents/skills/flash-review/SKILL.md` | Read-only evidence audit, contradiction checks, completeness, sharing readiness | Active |
| flashtotype-product-sidekick | Installed skill | `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` | Product discovery, evidence-backed research, persona and risk synthesis, board generation | Active |
| flashtotype-presentation-generator | Installed skill | `.flashtotype/skills/flashtotype-presentation-generator/SKILL.md` | Static stakeholder slide stories, local generated slide visuals, evidence-labeled presentation pages, speaker notes | Active |
| safe-run-rules | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/safe-run-rules.md` | Safe iteration, checkpoints, verification, handoff | Active |
| interview-flow | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/interview-flow.md` | PM/PO grilling questions, product clarity, assumption discovery | Active |
| evidence-rules | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/evidence-rules.md` | Claim labels, source quality, confidence control | Active |
| output-contract | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/output-contract.md` | Board data shape, required artifacts, final handoff | Active |

## Copyable Skill Prompts

Agents should mirror these prompts into the `skills[].prompt` fields on the board library page so users can expand and copy them.

### flash-onboard

```text
Use $flash-onboard to start or resume this project's guided Flashtotype product discovery workflow.
```

### flash-revise

```text
Use $flash-revise to apply my requested change to the existing Flashtotype decision pack and regenerate affected board content.
```

### flash-present

```text
Use $flash-present to create or refresh the stakeholder presentation from this Flashtotype decision pack with the default opening and thank-you slides.
```

### flash-research

```text
Use $flash-research to research my requested product question and update the evidence ledger and affected Flashtotype artifacts.
```

### flash-review

```text
Use $flash-review to audit this Flashtotype decision pack for evidence gaps, contradictions, completeness, and sharing readiness.
```

### flashtotype-product-sidekick

```text
Use Flashtotype as the PM/PO sidekick for this project.

First read `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` and follow it as the primary workflow. Interview me before generating artifacts. Produce product, market, persona, and tech/risk angles. Label every important claim as `Source-backed`, `Assumption`, or `Needs validation`. Update `flashtotype-workspace/current/user-editable/` source files and regenerate `flashtotype-workspace/current/output/index.html` as a static board.
```

### flashtotype-presentation-generator

```text
Use $flashtotype-presentation-generator for this Flashtotype project.

Read `.flashtotype/skills/flashtotype-presentation-generator/SKILL.md` and follow it as the primary workflow. Create or update `flashtotype-workspace/current/user-editable/presentation.md` from the existing Flashtotype artifacts: `flashtotype-brief.md`, `decision-pack.md`, `evidence.json`, `user-journey.md`, `prototype.md`, `Design.md`, and `flashtotype-library.md`. Build a static 16:9 stakeholder slide story with the default opening and thank-you slides, evidence labels, source notes, speaker notes, generated image prompts, local visual asset references, top assumptions, validation gaps, and next actions. If image generation is available, save slide images under `flashtotype-workspace/current/output/assets/`; otherwise keep prompt-only visual placeholders. Regenerate the `presentation` page data inside `flashtotype-workspace/current/output/index.html` without adding a backend, build step, package manager, or network dependency.
```

### safe-run-rules

```text
Before editing any Flashtotype artifact, read `.flashtotype/skills/flashtotype-product-sidekick/references/safe-run-rules.md`.

Inspect the current user-editable artifacts and output HTML, write a compact impact map, preserve existing user work, verify evidence JSON and embedded board JSON, and finish with changed files, confidence, assumptions, validation gaps, and next actions.
```

### interview-flow

```text
Before creating the decision pack, read `.flashtotype/skills/flashtotype-product-sidekick/references/interview-flow.md`.

Ask only questions that materially change the decision: product idea, user/buyer, painful workflow, current workaround, prototype scenario, constraints, success metric, and riskiest assumptions. Do not generate final artifacts until the stop condition is clear or assumptions are explicitly labeled.
```

### evidence-rules

```text
Before making market, user, product, or technology claims, read `.flashtotype/skills/flashtotype-product-sidekick/references/evidence-rules.md`.

Do not invent citations. Use `Source-backed` only when a matching source record exists in `evidence.json`; otherwise use `Assumption` or `Needs validation`. Treat legal, medical, financial, privacy, security, and compliance claims as `Needs validation` unless authoritative sources support them.
```

### output-contract

```text
Before updating the visual board, read `.flashtotype/skills/flashtotype-product-sidekick/references/output-contract.md`.

Keep source docs in `flashtotype-workspace/current/user-editable/`, generated files in `flashtotype-workspace/current/output/`, generated slide images in `flashtotype-workspace/current/output/assets/`, and update the `flashtotype-data` JSON in `output/index.html` with all six pages: home, journey, prototype, design, presentation, and library. Keep `flashtotype.js` generic and require no backend or build step.
```

## Optional Presentation Export Paths

These are informational references only. Flashtotype v1 does not install or depend on them.

| Option | Use When | Notes |
| --- | --- | --- |
| OpenAI `$slides` | The user's Codex environment includes the slides skill and they want editable PPTX output. | Optional follow-up after the static Flashtotype deck exists. |
| Marp | The user wants Markdown-based export to HTML, PDF, or PowerPoint. | Requires separate Marp tooling. |
| Public PPTX skills | The user wants third-party editable deck generators such as presentation-skill or SlideSpeak. | May require dependencies, accounts, APIs, or extra setup. |

## Suggested Frameworks

| Framework | Use When | Output |
| --- | --- | --- |
| Evidence labels | Claims need confidence clarity. | Source-backed, Assumption, Needs validation |
| Success metric trio | The team needs measurement discipline. | User behavior metric, business metric, guardrail metric |
| Prototype scenario | The idea is still abstract. | One workflow that proves the painful moment |
| Presentation story | The team needs a stakeholder readout. | Static 16:9 story deck with evidence labels, local slide visuals, speaker notes, and presenter mode |
| Risk review | Feasibility or compliance is uncertain. | Technical, data, delivery, and adoption risks |
| Team narrative | The team needs alignment. | Why, who, how, next decision |

## Design System Starters

- Calm SaaS/productivity theme.
- Research board theme.
- Internal ops dashboard theme.
- Marketplace/product discovery theme.

## Research Starters

- Competitor/substitute scan.
- User workflow interview.
- Pricing and willingness-to-pay signal.
- Technical feasibility scan.
- Compliance and privacy risk scan.

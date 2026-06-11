# Flashtotype Library

Use this file as the source for the `Flashtotype library` board page.

## Installed Skills And Workflow Modules

| Name | Type | Path | Used For | Status |
| --- | --- | --- | --- | --- |
| flashtotype-product-sidekick | Installed skill | `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` | Product discovery, evidence-backed research, persona and risk synthesis, board generation | Active |
| safe-run-rules | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/safe-run-rules.md` | Safe iteration, checkpoints, verification, handoff | Active |
| interview-flow | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/interview-flow.md` | PM/PO grilling questions, product clarity, assumption discovery | Active |
| evidence-rules | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/evidence-rules.md` | Claim labels, source quality, confidence control | Active |
| output-contract | Required workflow module | `.flashtotype/skills/flashtotype-product-sidekick/references/output-contract.md` | Board data shape, required artifacts, final handoff | Active |

## Copyable Skill Prompts

Agents should mirror these prompts into the `skills[].prompt` fields on the board library page so users can expand and copy them.

### flashtotype-product-sidekick

```text
Use Flashtotype as the PM/PO sidekick for this project.

First read `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` and follow it as the primary workflow. Interview me before generating artifacts. Produce product, market, persona, and tech/risk angles. Label every important claim as `Source-backed`, `Assumption`, or `Needs validation`. Update `flashtotype-workspace/current/user-editable/` source files and regenerate `flashtotype-workspace/current/output/index.html` as a static board.
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

Keep source docs in `flashtotype-workspace/current/user-editable/`, generated files in `flashtotype-workspace/current/output/`, and update the `flashtotype-data` JSON in `output/index.html` with all five pages: home, journey, prototype, design, and library. Keep `flashtotype.js` generic and require no backend or build step.
```

## Suggested Frameworks

| Framework | Use When | Output |
| --- | --- | --- |
| Evidence labels | Claims need confidence clarity. | Source-backed, Assumption, Needs validation |
| Success metric trio | The team needs measurement discipline. | User behavior metric, business metric, guardrail metric |
| Prototype scenario | The idea is still abstract. | One workflow that proves the painful moment |
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

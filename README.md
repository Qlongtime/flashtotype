# Flashtotype

Flashtotype is a lightweight PM/PO agent toolkit for turning early product ideas into evidence-labeled decision packs, static HTML prototypes, and presentation-ready stakeholder slide stories.

It is designed for a simple workflow: give this repository link to your coding agent and ask it to install Flashtotype into your project. The agent sets up the PM/PO sidekick skill, private workspace, evidence rules, and static output templates.

## Quick Start

Ask your agent:

```text
Use the Flashtotype repository to install the Flashtotype PM/PO sidekick into this project. Keep generated work private by default, then interview me and create a decision pack.
```

The agent should read `AGENTS.md` first. It will create:

- `.flashtotype/` with portable agent-only skills and generated-output templates.
- `flashtotype-workspace/current/user-editable/` for PO/PM source files, reference docs, design notes, CSVs, and assets.
- `flashtotype-workspace/current/output/` for the HTML board users can open in a browser, plus local generated presentation images under `output/assets/`.
- A `.gitignore` entry so generated work is private by default.
- A project-local `AGENTS.md` section so future agents know how to run the workflow.

## What Flashtotype Produces

Each run creates a decision pack with four angles:

- Product idea: problem, customer, use case, success metric, constraints, assumptions.
- Market research: substitutes, competitors, trends, evidence, validation gaps.
- User persona: target persona, jobs, pains, current workflow, adoption trigger.
- Tech stack and risk: feasibility, architecture direction, dependencies, security, operational risk.

The canonical source of truth is:

- `flashtotype-brief.md` for the human-readable decision pack.
- `evidence.json` for source URLs, access dates, confidence, and claim labels.
- `presentation.md` for the stakeholder slide story.

The visual output is a static HTML briefing page:

- `index.html`
- `flashtotype.js`
- `flashtotype-codex-bridge.mjs`
- `start-flashtotype-bridge.ps1`
- `start-flashtotype-bridge.cmd`
- `logo.png`
- `assets/` for generated slide images and other local run assets

The page renders a Miro-inspired board with Homepage, User journey flow, Prototype, Design system, and Flashtotype library rail pages. The Homepage includes a Presentation mode button that opens the internal Presentation page with 16:9 slide cards, generated-image prompts, local image assets, and a fullscreen presenter mode.

No backend, database, package manager, or build step is required. Users can optionally start the local Codex bridge when they want a board prompt to launch Codex on their own machine. The easiest path is to open the board, inspect the visible agent control prompt, optionally expand the user request drawer, click `Run prompt`, then copy the start command from the connection popup:

```text
powershell -NoProfile -ExecutionPolicy Bypass -File ".\start-flashtotype-bridge.ps1" -Token "<page-generated-token>"
```

The bridge listens only on `127.0.0.1`. The board generates a local token, shows a copyable start command when the bridge is offline, and keeps the static board usable without the bridge through editable/copyable prompts.

## Evidence Policy

Every important claim must be labeled:

- `Source-backed`: supported by a cited source.
- `Assumption`: reasonable but not externally verified.
- `Needs validation`: important and currently unsupported.

Market and technology claims should include source URL, access date, confidence, and a short note when web access is available. If the agent cannot browse or the user forbids browsing, it must mark external claims as `Assumption` or `Needs validation`.

## Repository Map

- `AGENTS.md`: universal agent entrypoint and bootstrap instructions.
- `agent/skills/flashtotype-product-sidekick/`: agent-only PM/PO workflow skill.
- `agent/skills/flashtotype-presentation-generator/`: agent-only presentation generator skill.
- `agent/board-template/`: master static board template used to generate user output.
- `user-workspace-template/current/user-editable/`: user-editable source templates for a Flashtotype run.
- `docs/`: public usage, evidence, and output contract docs.
- `scripts/validate.mjs`: lightweight repository validation.

## Public Safety

This repository should stay public-safe. Generated user research and prototypes belong in `flashtotype-workspace/`, which is gitignored by default. Promote only sanitized outputs into tracked docs.

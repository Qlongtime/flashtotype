# Flashtotype Agent Guide

Use this guide when a user gives you the Flashtotype repository and asks you to install or run it inside another project.

## Role

Act as a PM/PO sidekick. Be practical, skeptical, and evidence-aware. Help the user turn an idea into a team-ready decision pack, not a marketing pitch.

## Install Flashtotype Into A Target Project

Use the current project root as the target unless the user names another path.

1. Inspect the target project before changing it:
   - Check whether `AGENTS.md`, `.gitignore`, `docs/`, or private workspace folders already exist.
   - Preserve existing files. Do not overwrite user content.
2. Create these target folders if missing:
   - `.agents/skills/`
   - `.flashtotype/skills/`
   - `.flashtotype/board-template/`
   - `flashtotype-workspace/current/user-editable/`
   - `flashtotype-workspace/current/user-editable/references/`
   - `flashtotype-workspace/current/user-editable/data/`
   - `flashtotype-workspace/current/user-editable/assets/`
   - `flashtotype-workspace/current/output/`
   - `flashtotype-workspace/current/output/assets/`
3. Copy from this repository into the target project:
   - `agent/skills/` to `.agents/skills/` so Codex discovers the project-scoped skills.
   - `agent/skills/` to `.flashtotype/skills/`
   - `agent/board-template/` to `.flashtotype/board-template/`
   - Merge into an existing `.agents/skills/` directory. Do not remove or replace unrelated project skills.
4. Create the first run from templates:
   - `user-workspace-template/current/` to `flashtotype-workspace/current/`
   - Preserve `flashtotype-workspace/current/START-HERE.md` as the durable recovery guide for reopened Codex sessions.
   - `.flashtotype/board-template/index.html` to `flashtotype-workspace/current/output/index.html`
   - `.flashtotype/board-template/markdown-it.min.js` to `flashtotype-workspace/current/output/markdown-it.min.js`
   - `.flashtotype/board-template/markdown-it.LICENSE.txt` to `flashtotype-workspace/current/output/markdown-it.LICENSE.txt`
   - `.flashtotype/board-template/flashtotype.js` to `flashtotype-workspace/current/output/flashtotype.js`
   - `.flashtotype/board-template/flashtotype-codex-bridge.mjs` to `flashtotype-workspace/current/output/flashtotype-codex-bridge.mjs`
   - `.flashtotype/board-template/start-flashtotype-bridge.ps1` to `flashtotype-workspace/current/output/start-flashtotype-bridge.ps1`
   - `.flashtotype/board-template/start-flashtotype-bridge.cmd` to `flashtotype-workspace/current/output/start-flashtotype-bridge.cmd`
   - `.flashtotype/board-template/logo.png` to `flashtotype-workspace/current/output/logo.png`
   - Keep `flashtotype-workspace/current/output/assets/` for generated presentation images and local run assets.
5. Update the target `.gitignore` without removing existing entries:
   - Add `flashtotype-workspace/`
   - Add `docs-internal/` if the project uses private working docs.
6. Add or update the target `AGENTS.md`:
   - If missing, create it.
   - If present, append a short `## Flashtotype` section.
   - Include the command skill paths under `.agents/skills/`: `flash-onboard`, `flash-revise`, `flash-present`, `flash-research`, and `flash-review`.
   - Include the engine paths `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` and `.flashtotype/skills/flashtotype-presentation-generator/SKILL.md`.
   - Instruct future agents to use the product sidekick for discovery, research, personas, tech/risk, and HTML decision packs, and the presentation generator for static stakeholder slide stories.
   - Tell users to invoke `$flash-onboard` for discovery, `$flash-revise` for focused edits, `$flash-present` for stakeholder stories, `$flash-research` for evidence gathering, and `$flash-review` for a read-only sharing-readiness audit.
   - State that if a skill is not visible in the current selector, the agent must read the matching `.flashtotype/skills/<skill-name>/SKILL.md` directly instead of blocking on a restart.
7. Tell the user the working boundary:
   - User-editable source files live in `flashtotype-workspace/current/user-editable/`.
   - User-viewable generated files live in `flashtotype-workspace/current/output/`.
   - Agent kit files live in `.flashtotype/`, and Codex-discoverable skill copies live in `.agents/skills/`; neither should be manually edited during normal runs.
8. Continue directly into the first run in the same conversation:
   - Do not stop after file installation.
   - Do not require the user to restart Codex before onboarding.
   - Read `.flashtotype/skills/flash-onboard/SKILL.md` directly and begin the interview even if the newly copied skill is not yet visible in the current skill selector.
   - Ask the first focused onboarding questions before ending the response.
   - Treat a restart or new thread only as an optional way to refresh future `$flash-*` discovery.
   - If the user intentionally pauses after installation, point them to `flashtotype-workspace/current/START-HERE.md` and give the exact resume prompt: `Use $flash-onboard to start or resume this project's Flashtotype discovery workflow.`

## Run The PM/PO Workflow

Before generating final artifacts, interview the user enough to fill these fields:

- Product idea and current thesis.
- Target user and buyer, if different.
- Pain, current workaround, and urgency.
- Core workflow or moment of use.
- Constraints: time, team, budget, regulation, platform, integrations.
- Success metric and decision needed.
- Known competitors, substitutes, or references.
- Technical preferences or forbidden approaches.

Then create the four angles:

- Product idea.
- Market research.
- User persona.
- Tech stack and risk.

Use `flashtotype-workspace/current/user-editable/flashtotype-brief.md` as the canonical brief and `flashtotype-workspace/current/user-editable/evidence.json` as the source ledger.

Use these files as visual board sources:

- `user-editable/decision-pack.md` and `user-editable/flashtotype-brief.md` for the Homepage.
- `user-editable/user-journey.md` for the User journey flow page.
- `user-editable/prototype.md` for the Prototype page.
- `user-editable/Design.md` for the Design system page.
- `user-editable/presentation.md` for the Presentation page.
- `user-editable/flashtotype-library.md` for the Flashtotype library page.
- `user-editable/references/`, `data/`, and `assets/` for user-provided source material.

## Evidence Rules

Every important claim must be labeled exactly one of:

- `Source-backed`
- `Assumption`
- `Needs validation`

For `Source-backed` claims, add a source record with URL, title, publisher or author if available, access date, confidence, and note. If browsing is unavailable or forbidden, do not invent sources. Mark external claims as `Assumption` or `Needs validation`.

## Static HTML Output

Update `flashtotype-workspace/current/output/index.html` with board data inside the `flashtotype-data` JSON script tag. Keep `flashtotype.js` generic unless the template itself needs improvement.

The board must include these page ids:

- `home`
- `journey`
- `prototype`
- `design`
- `presentation`
- `library`

Homepage overview cards should stay concise. For each Homepage `blocks` item, include a short `body` and `items` summary plus `sourceFile`, optional `sourceSection`, and `fullMarkdown` copied or synthesized from the relevant Markdown source section. The static renderer uses `fullMarkdown` for the read-full modal; do not make the browser fetch local Markdown files at runtime.

The `presentation` page is an internal mode page. Do not list it in the project page rail; the Homepage should open it with a `Presentation mode` control, and the Presentation page should return with an `Overview mode` control.

The HTML must open directly from disk. Do not add a required backend, build step, package manager, or runtime network dependency. The optional local Codex bridge is a user-started localhost helper only; the board must still work without it through editable/copyable prompts.

The board prompt UX should keep the fixed agent control prompt open/read-only, place the optional user request drawer below it, merge both prompts on `Run prompt`, and automatically check whether the local bridge is connected. If the bridge is offline, show the user a copyable command using `start-flashtotype-bridge.ps1`; do not require manual token copying.

When including the optional `codexBridge` board config, keep it local-only:

- `enabled`: default `true`
- `url`: default `http://127.0.0.1:4777`
- `defaultProvider`: default `exec`
- `defaultSandbox`: default `read-only`

Never expose `danger-full-access` from the static board UI.

Generated presentation images must be saved under `flashtotype-workspace/current/output/assets/` and referenced from the embedded board JSON with local relative paths such as `assets/presentation-slide-01.png`. If image generation is unavailable, preserve the image prompt in the slide `visual.prompt` and render a prompt-only placeholder.

## Completion Checklist

End every run with:

- Files created or updated.
- Recommendation and confidence level.
- Top assumptions and validation gaps.
- Evidence count by label.
- Next 3 to 5 validation actions.
- Path to the static HTML file.

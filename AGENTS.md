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
   - `.flashtotype/skills/flashtotype-product-sidekick/`
   - `.flashtotype/templates/workspace/`
   - `.flashtotype/templates/html/`
   - `flashtotype-workspace/current/`
   - `flashtotype-workspace/current/html/`
3. Copy from this repository into the target project:
   - `skills/flashtotype-product-sidekick/` to `.flashtotype/skills/flashtotype-product-sidekick/`
   - `templates/workspace/` to `.flashtotype/templates/workspace/`
   - `templates/html/` to `.flashtotype/templates/html/`
4. Create the first run from templates:
   - `.flashtotype/templates/workspace/flashtotype-brief.md` to `flashtotype-workspace/current/flashtotype-brief.md`
   - `.flashtotype/templates/workspace/evidence.json` to `flashtotype-workspace/current/evidence.json`
   - `.flashtotype/templates/workspace/decision-pack.md` to `flashtotype-workspace/current/decision-pack.md`
   - `.flashtotype/templates/html/index.html` to `flashtotype-workspace/current/html/index.html`
   - `.flashtotype/templates/html/flashtotype.js` to `flashtotype-workspace/current/html/flashtotype.js`
5. Update the target `.gitignore` without removing existing entries:
   - Add `flashtotype-workspace/`
   - Add `docs-internal/` if the project uses private working docs.
6. Add or update the target `AGENTS.md`:
   - If missing, create it.
   - If present, append a short `## Flashtotype` section.
   - Include the path `.flashtotype/skills/flashtotype-product-sidekick/SKILL.md` and instruct future agents to use it for product discovery, research, personas, tech/risk, and HTML decision packs.

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

Use `flashtotype-workspace/current/flashtotype-brief.md` as the canonical brief and `flashtotype-workspace/current/evidence.json` as the source ledger.

## Evidence Rules

Every important claim must be labeled exactly one of:

- `Source-backed`
- `Assumption`
- `Needs validation`

For `Source-backed` claims, add a source record with URL, title, publisher or author if available, access date, confidence, and note. If browsing is unavailable or forbidden, do not invent sources. Mark external claims as `Assumption` or `Needs validation`.

## Static HTML Output

Update `flashtotype-workspace/current/html/index.html` with the run data inside the `flashtotype-data` JSON script tag. Keep `flashtotype.js` generic unless the template itself needs improvement.

The HTML must open directly from disk. Do not add a backend, build step, package manager, or network dependency.

## Completion Checklist

End every run with:

- Files created or updated.
- Recommendation and confidence level.
- Top assumptions and validation gaps.
- Evidence count by label.
- Next 3 to 5 validation actions.
- Path to the static HTML file.


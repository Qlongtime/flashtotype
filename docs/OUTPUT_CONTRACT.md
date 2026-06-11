# Output Contract

Each Flashtotype run produces a private decision pack in `flashtotype-workspace/current/`.

## Required Artifacts

User-editable source files live in `flashtotype-workspace/current/user-editable/`:

- `flashtotype-brief.md`: canonical human-readable product brief.
- `evidence.json`: source and claim ledger.
- `decision-pack.md`: concise team-ready summary.
- `user-journey.md`: source for the visual user journey flow.
- `prototype.md`: source for the main prototype workspace.
- `Design.md`: source for theme, tokens, components, and design references.
- `flashtotype-library.md`: source for suggested PO/PM frameworks.
- `references/`: user-provided research docs, interview notes, links, and source summaries.
- `data/`: user-provided CSV, JSON, exports, metrics, and research tables.
- `assets/`: user-provided screenshots, diagrams, brand images, and design references.

Generated output lives in `flashtotype-workspace/current/output/`:

- `output/index.html`: static visual board page users open in a browser.
- `output/flashtotype.js`: generic renderer for the page.
- `output/logo.png`: Flashtotype header logo asset used by the static board.

## Brief Sections

`flashtotype-brief.md` must include:

- Product thesis.
- Interview notes.
- Product idea angle.
- Market research angle.
- User persona angle.
- Tech stack and risk angle.
- Prototype direction.
- Recommendation.
- Assumptions and validation gaps.
- Next validation actions.

## Visual Board Pages

The static HTML renders a Miro-inspired board with these required pages:

- `home`: Notion-style project summary from `decision-pack.md`, `flashtotype-brief.md`, and `evidence.json`.
- `journey`: user journey flow from `user-journey.md`.
- `prototype`: main PO/PM prototype iteration workspace from `prototype.md`.
- `design`: design system and theme view from `Design.md`.
- `library`: installed skills, active workflow modules, and Flashtotype framework suggestions from `flashtotype-library.md`.

## Evidence JSON Shape

`evidence.json` stores arrays of `sources` and `claims`.

Each claim must include:

- `id`
- `claim`
- `label`
- `confidence`
- `source_ids`
- `notes`

Each source must include:

- `id`
- `title`
- `url`
- `publisher`
- `accessed_at`
- `notes`

## Static HTML Data

The generated `output/index.html` contains a JSON script tag with id `flashtotype-data`. `flashtotype.js` reads that data and renders the page locally without a server.

The embedded JSON must include:

- `projectName`
- `subtitle`
- `status`
- `sourceFiles`
- `pages`

The `pages` array must include page objects with ids `home`, `journey`, `prototype`, `design`, and `library`.

The `library` page should include a `skills` array listing installed skills and active workflow modules used by the project.

Each `skills` item should include:

- `name`
- `type`
- `status`
- `path`
- `description`
- `usedFor`
- `prompt`: the real agent prompt users can expand, inspect, and copy to confirm or reuse the skill/module workflow.

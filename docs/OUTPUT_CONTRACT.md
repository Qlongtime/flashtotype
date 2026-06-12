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
- `presentation.md`: source for the static 16:9 stakeholder presentation page.
- `flashtotype-library.md`: source for suggested PO/PM frameworks.
- `references/`: user-provided research docs, interview notes, links, and source summaries.
- `data/`: user-provided CSV, JSON, exports, metrics, and research tables.
- `assets/`: user-provided screenshots, diagrams, brand images, and design references.

Generated output lives in `flashtotype-workspace/current/output/`:

- `output/index.html`: static visual board page users open in a browser.
- `output/flashtotype.js`: generic renderer for the page.
- `output/logo.png`: Flashtotype header logo asset used by the static board.
- `output/assets/`: generated local assets, including presentation slide images.

## Brief Sections

`flashtotype-brief.md` must include:

- Product thesis.
- Interview notes.
- Product idea angle.
- Market research angle.
- User persona angle.
- Tech stack and risk angle.
- Prototype direction.
- Presentation direction.
- Recommendation.
- Assumptions and validation gaps.
- Next validation actions.

## Visual Board Pages

The static HTML renders a Miro-inspired board with these required pages:

- `home`: Notion-style project summary from `decision-pack.md`, `flashtotype-brief.md`, and `evidence.json`.
- `journey`: user journey flow from `user-journey.md`.
- `prototype`: main PO/PM prototype iteration workspace from `prototype.md`.
- `design`: design system and theme view from `Design.md`.
- `presentation`: internal static stakeholder slide story from `presentation.md`, opened from the Homepage Presentation mode button instead of the project page rail.
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

The `pages` array must include page objects with ids `home`, `journey`, `prototype`, `design`, `presentation`, and `library`.

The `presentation` page should include:

- `audience`
- `decision`
- `hiddenFromMenu`: `true`, so the page is available as Presentation mode but not listed in the project page rail.
- `prompt`: the copyable prompt users can click in static HTML.
- `slides`: an array of 16:9 slide cards with `eyebrow`, `title`, `body`, `bullets`, `visual`, `evidenceLabel`, `sourceNote`, and `speakerNotes`.

Each presentation slide `visual` object may include:

- `layout`: one of `split-right`, `split-left`, `full-bleed`, or `none`.
- `prompt`: the image prompt built from the same Flashtotype source data as the slide.
- `src`: a local relative path from `output/index.html`, such as `assets/presentation-slide-01.png`.
- `alt`: accessible image description.
- `status`: `generated`, `prompt-only`, or another explicit run status.

Do not use external URLs, absolute paths, or data URLs in `visual.src`. If image generation is unavailable, leave `visual.src` blank, keep `visual.prompt`, and set `visual.status` to `prompt-only`.

The Homepage should include a `Presentation mode` control that switches to the presentation page. The presentation page should include an `Overview mode` control that returns to the Homepage, plus a `Present` control that opens the same slides in a static fullscreen-capable presenter overlay.

The `library` page should include a `skills` array listing installed skills and active workflow modules used by the project.

Each `skills` item should include:

- `name`
- `type`
- `status`
- `path`
- `description`
- `usedFor`
- `prompt`: the real agent prompt users can expand, inspect, and copy to confirm or reuse the skill/module workflow.

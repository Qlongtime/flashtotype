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
- `output/markdown-it.min.js`: bundled local Markdown renderer for full-content modals and Markdown-heavy artifacts.
- `output/markdown-it.LICENSE.txt`: upstream MIT license for the bundled Markdown renderer.
- `output/flashtotype.js`: generic renderer for the page.
- `output/flashtotype-codex-bridge.mjs`: optional user-started localhost helper for sending board prompts to local Codex.
- `output/start-flashtotype-bridge.ps1`: optional Windows-friendly start script that checks the lowest local prerequisites and launches the bridge with the board-generated token.
- `output/start-flashtotype-bridge.cmd`: optional wrapper for launching the PowerShell start script.
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

The generated `output/index.html` contains a JSON script tag with id `flashtotype-data`. `flashtotype.js` reads that data and renders the page locally without a server. The page loads `markdown-it.min.js` locally for GitHub-style Markdown features such as pipe tables, with raw HTML disabled by the renderer.

The embedded JSON must include:

- `projectName`
- `subtitle`
- `status`
- `sourceFiles`
- `pages`

The embedded JSON may include `codexBridge`. If omitted, the renderer uses these defaults:

- `enabled`: `true`
- `url`: `http://127.0.0.1:4777`
- `defaultProvider`: `exec`
- `defaultSandbox`: `read-only`

`codexBridge.url` must be loopback-only. The bridge is optional progressive enhancement; the board must still open directly from disk and preserve editable/copyable prompts when no bridge is running. The rendered prompt UI should keep the fixed control prompt open/read-only, place an optional user request drawer below it, merge both prompts on `Run prompt`, and show a copyable start command if the bridge is offline.

The `pages` array must include page objects with ids `home`, `journey`, `prototype`, `design`, `presentation`, and `library`.

The renderer supports an optional internal intro page:

- `intro`: Flashtotype-owned introduction page, hidden from the project page rail and opened by the topbar logo. If omitted, `flashtotype.js` injects a default intro page at runtime.

The `prototype` page must include a non-empty `screens` array. Each screen should include:

- `title`, `state`, `body`, `x`, and `y`.
- `device`: `mobile` or `desktop`.
- Optional `step`, `eyebrow`, `width`, and `navigation`.
- `elements`: product-specific structured content. Do not use anonymous skeleton blocks.

Supported prototype element types are:

- `text`: `eyebrow`, `title`, `body`, `tone`.
- `field`: `label`, `value` or `placeholder`, optional `meta` or `status`.
- `list`: `title` and `items`; item objects may include `title`, `body`, `meta`, or `status`.
- `card`: `eyebrow`, `title`, `body`, `meta`, `tags`, `tone`.
- `notice`: `title`, `body`, `tone`.
- `actions`: `primary` and optional `secondary`.
- `progress`: `title`, numeric `value` from 0 to 100, and optional `displayValue`.

Supported tones are `neutral`, `accent`, `success`, `warning`, and `danger`. The renderer should show a meaningful notice for legacy screens without `elements`, never generic gray skeleton cards.

The `home` page should include a `blocks` array for product overview cards. Each block should show summarized content on the board and provide embedded full Markdown for the read-full modal:

- `title`: overview card title.
- `body`: short summary shown on the card.
- `items`: short bullet summary shown on the card.
- `sourceFile`: source Markdown file path, such as `user-editable/decision-pack.md`.
- `sourceSection`: optional source heading or section name.
- `fullMarkdown`: Markdown content copied or synthesized from that source section.

Do not fetch local Markdown files from the browser at runtime. The HTML must open directly from disk, so full content needed by the modal must be embedded in the board JSON.

The `presentation` page should include:

- `audience`
- `decision`
- `hiddenFromMenu`: `true`, so the page is available as Presentation mode but not listed in the project page rail.
- `prompt`: the fixed agent control prompt users can inspect in static HTML, copy with their added request, and optionally send to the local Codex bridge.
- `slides`: an array of 16:9 slide cards with `eyebrow`, `title`, `body`, `bullets`, `visual`, `evidenceLabel`, `sourceNote`, and `speakerNotes`.

Default generated decks should use a 10-slide decision story that starts with an opening title/context slide and ends with a thank-you or decision-close slide. If a user asks for another deck length, preserve those first and last boundary slides by default and compress the middle story.

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
- `prompt`: the real fixed agent prompt users can expand, copy with their added request, and optionally send to the local Codex bridge to confirm or reuse the skill/module workflow.

Installed Flashtotype projects should include `flash-onboard`, `flash-revise`, `flash-present`, `flash-research`, and `flash-review` command-skill entries pointing to `.agents/skills/`, plus the full product-sidekick and presentation-generator entries from `.flashtotype/skills/`.

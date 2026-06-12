# Output Contract

Generate artifacts in `flashtotype-workspace/current/`.

## Files

User-editable source files live in `flashtotype-workspace/current/user-editable/`:

- `flashtotype-brief.md`: canonical brief.
- `evidence.json`: source and claim ledger.
- `decision-pack.md`: concise shareable summary.
- `user-journey.md`: source for the visual user journey flow.
- `prototype.md`: source for the main prototype workspace.
- `Design.md`: source for theme, tokens, components, and design references.
- `presentation.md`: source for the static 16:9 stakeholder presentation page.
- `flashtotype-library.md`: source for Flashtotype framework suggestions.
- `references/`: user-provided research docs, interview notes, links, and source summaries.
- `data/`: user-provided CSV, JSON, exports, metrics, and research tables.
- `assets/`: user-provided screenshots, diagrams, brand images, and design references.

Generated output lives in `flashtotype-workspace/current/output/`:

- `output/index.html`: static Miro-inspired board users open in a browser.
- `output/flashtotype.js`: reusable renderer.
- `output/flashtotype-codex-bridge.mjs`: optional user-started localhost helper for sending board prompts to local Codex.
- `output/start-flashtotype-bridge.ps1`: optional Windows-friendly start script that checks the lowest local prerequisites and launches the bridge with the board-generated token.
- `output/start-flashtotype-bridge.cmd`: optional wrapper for launching the PowerShell start script.
- `output/logo.png`: Flashtotype header logo asset used by the static board.
- `output/assets/`: generated local assets, including presentation slide images.

## HTML Data

Update the JSON inside:

```html
<script type="application/json" id="flashtotype-data">
```

Use this top-level shape:

```json
{
  "projectName": "",
  "subtitle": "",
  "status": "",
  "updatedAt": "",
  "sourceFiles": [],
  "codexBridge": {
    "enabled": true,
    "url": "http://127.0.0.1:4777",
    "defaultProvider": "exec",
    "defaultSandbox": "read-only"
  },
  "pages": []
}
```

`codexBridge` is optional. If present, keep `url` loopback-only. The board must still open directly from disk and preserve editable/copyable prompts when the bridge is not running. The rendered prompt UI should keep the fixed control prompt open/read-only, place an optional user request drawer below it, merge both prompts on `Run prompt`, and show a copyable start command if the bridge is offline.

The `pages` array must include:

- `home`: Notion-style overview from `decision-pack.md`, `flashtotype-brief.md`, and `evidence.json`.
- `journey`: user journey flow from `user-journey.md`.
- `prototype`: main PO/PM prototype workspace from `prototype.md`.
- `design`: design system view from `Design.md`.
- `presentation`: internal static stakeholder slide story from `presentation.md`, opened from the Homepage Presentation mode button instead of the project page rail.
- `library`: installed skills, active workflow modules, and Flashtotype framework suggestions from `flashtotype-library.md`.

The `prototype` page must contain product-specific screens rather than generic skeletons. Each screen should include `title`, `state`, `body`, `x`, `y`, `device`, and a non-empty `elements` array.

Supported `elements[].type` values are `text`, `field`, `list`, `card`, `notice`, `actions`, and `progress`. Use real product copy, field values or placeholders, lists, states, evidence or safety notices, actions, and outcomes from `prototype.md`. Supported tones are `neutral`, `accent`, `success`, `warning`, and `danger`.

The `home` page should include a `blocks` array for product overview cards. Each block should show summarized content on the board and provide embedded full Markdown for the read-full modal:

- `title`: overview card title.
- `body`: short summary shown on the card.
- `items`: short bullet summary shown on the card.
- `sourceFile`: source Markdown file path, such as `user-editable/decision-pack.md`.
- `sourceSection`: optional source heading or section name.
- `fullMarkdown`: Markdown content copied or synthesized from that source section.

Do not fetch local Markdown files from the browser at runtime. The HTML must open directly from disk, so full content needed by the modal must be embedded in the board JSON.

Keep `flashtotype.js` generic. Do not add required network dependencies or a build step. The optional Codex bridge must remain a local-only, user-started helper and must not expose `danger-full-access` from the board UI.

The `library` page should include a `skills` array listing installed skills and active workflow modules used by the project.

The `presentation` page should include:

- `audience`
- `decision`
- `hiddenFromMenu`: `true`, so the page is available as Presentation mode but not listed in the project page rail.
- `prompt`: the fixed agent control prompt users can inspect in static HTML, copy with their added request, and optionally send to the local Codex bridge.
- `slides`: an array of 16:9 slide cards with `eyebrow`, `title`, `body`, `bullets`, `visual`, `evidenceLabel`, `sourceNote`, and `speakerNotes`.

Each presentation slide `visual` object may include:

- `layout`: one of `split-right`, `split-left`, `full-bleed`, or `none`.
- `prompt`: the image prompt built from the same Flashtotype source data as the slide.
- `src`: a local relative path from `output/index.html`, such as `assets/presentation-slide-01.png`.
- `alt`: accessible image description.
- `status`: `generated`, `prompt-only`, or another explicit run status.

Do not use external URLs, absolute paths, or data URLs in `visual.src`. If image generation is unavailable, leave `visual.src` blank, keep `visual.prompt`, and set `visual.status` to `prompt-only`.

The Homepage should include a `Presentation mode` control that switches to the presentation page. The presentation page should include an `Overview mode` control that returns to the Homepage, plus a `Present` control that opens the same slides in a static fullscreen-capable presenter overlay.

Each `skills` item should include:

- `name`
- `type`
- `status`
- `path`
- `description`
- `usedFor`
- `prompt`: the real fixed agent prompt users can expand, copy with their added request, and optionally send to the local Codex bridge to confirm or reuse the skill/module workflow.

## Final Answer

After a run, report:

- What was generated.
- Recommendation and confidence.
- Evidence count by label.
- The path to `output/index.html`.
- Confirm all six board pages were updated or intentionally left as template placeholders.
- The top follow-up validation actions.

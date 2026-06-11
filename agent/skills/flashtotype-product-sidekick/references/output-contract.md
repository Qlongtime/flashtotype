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
- `flashtotype-library.md`: source for Flashtotype framework suggestions.
- `references/`: user-provided research docs, interview notes, links, and source summaries.
- `data/`: user-provided CSV, JSON, exports, metrics, and research tables.
- `assets/`: user-provided screenshots, diagrams, brand images, and design references.

Generated output lives in `flashtotype-workspace/current/output/`:

- `output/index.html`: static Miro-inspired board users open in a browser.
- `output/flashtotype.js`: reusable renderer.
- `output/logo.png`: Flashtotype header logo asset used by the static board.

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
  "pages": []
}
```

The `pages` array must include:

- `home`: Notion-style overview from `decision-pack.md`, `flashtotype-brief.md`, and `evidence.json`.
- `journey`: user journey flow from `user-journey.md`.
- `prototype`: main PO/PM prototype workspace from `prototype.md`.
- `design`: design system view from `Design.md`.
- `library`: installed skills, active workflow modules, and Flashtotype framework suggestions from `flashtotype-library.md`.

Keep `flashtotype.js` generic. Do not add network dependencies or a build step.

The `library` page should include a `skills` array listing installed skills and active workflow modules used by the project.

Each `skills` item should include:

- `name`
- `type`
- `status`
- `path`
- `description`
- `usedFor`
- `prompt`: the real agent prompt users can expand, inspect, and copy to confirm or reuse the skill/module workflow.

## Final Answer

After a run, report:

- What was generated.
- Recommendation and confidence.
- Evidence count by label.
- The path to `output/index.html`.
- Confirm all five board pages were updated or intentionally left as template placeholders.
- The top follow-up validation actions.

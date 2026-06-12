---
name: flashtotype-presentation-generator
description: Presentation generator workflow for turning Flashtotype PM/PO research into a static, evidence-labeled 16:9 stakeholder slide story. Use when a user asks to create, generate, draft, update, or communicate a presentation, deck, slides, pitch, stakeholder readout, executive summary, or data storytelling artifact from Flashtotype briefs, decision packs, evidence ledgers, journey notes, prototype notes, or design notes.
---

# Flashtotype Presentation Generator

## Operating Stance

Create decision-led presentation stories from Flashtotype research. Be concise, evidence-aware, and practical: the deck should help a team understand the product decision, not decorate unsupported claims. Visuals must come from the same Flashtotype sources as the slide narrative.

## Required Workflow

1. Inspect the project and find `.flashtotype/`, `flashtotype-workspace/current/user-editable/`, and `flashtotype-workspace/current/output/`.
2. Read `flashtotype-workspace/current/user-editable/flashtotype-brief.md`, `decision-pack.md`, `evidence.json`, `user-journey.md`, `prototype.md`, `Design.md`, and `flashtotype-library.md` when they exist.
3. Read `references/data-storytelling.md` before drafting slides.
4. Create or update `flashtotype-workspace/current/user-editable/presentation.md` as the canonical slide source, including visual layout, image prompt, local image path, alt text, and status for each slide.
5. Build each image prompt from `flashtotype-brief.md`, `decision-pack.md`, `evidence.json`, the slide content, and `Design.md`.
6. When image generation is available in the current agent environment, generate final slide images and save them under `flashtotype-workspace/current/output/assets/` with local relative paths such as `assets/presentation-slide-01.png`.
7. If image generation fails or is unavailable, keep the `visual.prompt`, set `visual.status` to `prompt-only`, leave `visual.src` blank, and continue generating the deck.
8. Update the `presentation` page data inside `flashtotype-workspace/current/output/index.html`.
9. Keep the presentation page hidden from the project page rail and reachable from the Homepage `Presentation mode` button, with an `Overview mode` button on the presentation page.
10. Keep `flashtotype.js` generic. Do not add a required backend, build step, package manager, runtime network dependency, Canva API, PPTX dependency, or Figma dependency for v1. The optional local Codex bridge is allowed only as a user-started localhost helper; the page must still work without it.

## Slide Spine

Use this default order unless the user asks for another audience or length:

1. Title and decision needed.
2. User pain and current workaround.
3. Research backup and confidence.
4. Primary persona and moment of use.
5. Proposed workflow.
6. Prototype story.
7. Risks, assumptions, and validation gaps.
8. Recommended next validation plan.

## Evidence Rules

- Label every important claim exactly `Source-backed`, `Assumption`, or `Needs validation`.
- Use `Source-backed` only when the claim has a matching source record in `evidence.json`.
- Keep validation gaps visible when they affect the recommendation.
- Put source titles, source IDs, or caveats in the slide `sourceNote` field.
- Add speaker notes that explain the narrative, caveats, and transition. Do not repeat slide text verbatim.

## HTML Board Data

The generated board data should include a page object like:

```json
{
  "id": "presentation",
  "label": "Presentation",
  "type": "presentation",
  "hiddenFromMenu": true,
  "sourceFiles": ["user-editable/presentation.md", "user-editable/decision-pack.md", "user-editable/flashtotype-brief.md", "user-editable/evidence.json"],
  "title": "Stakeholder Presentation",
  "summary": "",
  "audience": "",
  "decision": "",
  "prompt": "",
  "slides": [
    {
      "eyebrow": "01",
      "title": "",
      "body": "",
      "bullets": [],
      "visual": {
        "layout": "split-right",
        "prompt": "",
        "src": "assets/presentation-slide-01.png",
        "alt": "",
        "status": "generated"
      },
      "evidenceLabel": "Needs validation",
      "sourceNote": "",
      "speakerNotes": ""
    }
  ]
}
```

Supported `visual.layout` values are `split-right`, `split-left`, `full-bleed`, and `none`. Use only local relative paths in `visual.src`; do not use external URLs, absolute paths, or embedded data URLs.

The `prompt` value is the fixed agent control prompt users inspect from the static HTML board. The rendered board should keep that fixed prompt open, place optional user instructions in a collapsed drawer below it, copy the merged prompt, or click `Run prompt`; if the optional local Codex bridge is offline, the board shows a copyable localhost start command, and if it is online, the board sends the merged prompt with a page-generated token. The rendered board should show a `Presentation mode` button on the Homepage, keep the presentation page out of the project page rail, show an `Overview mode` button on the presentation page, and include a `Present` button that opens the static fullscreen presenter.

## Optional Export Paths

If the user's agent has a separate slide skill installed, mention it as an optional follow-up only after the static Flashtotype deck is generated:

- OpenAI `$slides`: editable PPTX generation when available in the user's Codex environment.
- Marp: Markdown to HTML, PDF, or PowerPoint export.
- Figma Slides, Canva, SlideSpeak, or other public PPTX skills: external workflows that may require accounts, connectors, APIs, or dependencies.

Do not make any optional export path required for the v1 Flashtotype output.

## Deliverables

End each run with:

- Presentation source path.
- HTML path.
- Slide count.
- Generated image count and output asset path, or prompt-only fallback count.
- Evidence count by label across the deck.
- Top assumptions and validation gaps.
- Next 3 to 5 validation actions.

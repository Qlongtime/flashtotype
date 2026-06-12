# Data Storytelling Rules

Use these rules when converting Flashtotype research into a presentation.

## Narrative

- Start with the decision needed, then show the evidence and tradeoffs that support it.
- Keep one main idea per slide.
- Use the user pain, workaround, and moment of use as the story thread.
- Prefer concrete next actions over broad inspiration.
- Match the audience: executive slides need recommendation, confidence, and risk; delivery-team slides need workflow, constraints, and validation tasks.

## Slide Content

- Use short titles that make a claim.
- Use body copy for context, not a second title.
- Keep bullets to 3 to 5 items.
- Convert evidence into meaning: what changed, why it matters, and what the team should do next.
- Put caveats, source notes, and confidence limits on the slide or in speaker notes.

## Evidence And Speaker Notes

- Preserve Flashtotype evidence labels exactly: `Source-backed`, `Assumption`, `Needs validation`.
- Do not upgrade a claim to `Source-backed` unless it maps to a source in `evidence.json`.
- Use speaker notes for the presenter narrative, transitions, caveats, and anticipated questions.
- Do not hide weak evidence. If a slide depends on a validation gap, make that visible.

## Visual Direction

- Use static 16:9 slide cards in the local HTML board.
- Keep the design calm, readable, and presentation-ready.
- Avoid dense research dumps. Move detail to source notes or speaker notes.
- Use optional external export tools only after the static board deck exists.

## Image Prompt Rules

- Build each image prompt from the same Flashtotype sources used by the slide: `flashtotype-brief.md`, `decision-pack.md`, `evidence.json`, slide content, and `Design.md`.
- Use visuals to clarify the decision, user pain, workflow, prototype story, risk, or validation plan; do not add new factual claims through imagery.
- Avoid false specificity: no invented customer logos, private data, source names, numbers, dashboards, charts, dates, or readable UI text.
- Use the project design direction from `Design.md` for mood, palette, and visual density when it exists.
- Save generated images under `flashtotype-workspace/current/output/assets/` and reference them with local relative paths from `output/index.html`.
- If image generation is unavailable, keep the prompt in the slide `visual.prompt`, set `visual.status` to `prompt-only`, and render the prompt placeholder.

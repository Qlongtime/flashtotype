# Output Contract

Generate artifacts in `flashtotype-workspace/current/`.

## Files

- `flashtotype-brief.md`: canonical brief.
- `evidence.json`: source and claim ledger.
- `decision-pack.md`: concise shareable summary.
- `html/index.html`: static briefing page with embedded JSON data.
- `html/flashtotype.js`: reusable renderer.

## HTML Data

Update the JSON inside:

```html
<script type="application/json" id="flashtotype-data">
```

Use this top-level shape:

```json
{
  "productName": "",
  "tagline": "",
  "updatedAt": "",
  "verdict": "",
  "confidence": "",
  "summary": "",
  "metrics": [],
  "sections": {},
  "evidence": [],
  "nextActions": []
}
```

Keep `flashtotype.js` generic. Do not add network dependencies or a build step.

## Final Answer

After a run, report:

- What was generated.
- Recommendation and confidence.
- Evidence count by label.
- The path to `html/index.html`.
- The top follow-up validation actions.


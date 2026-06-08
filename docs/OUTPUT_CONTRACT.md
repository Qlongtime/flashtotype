# Output Contract

Each Flashtotype run produces a private decision pack in `flashtotype-workspace/current/`.

## Required Artifacts

- `flashtotype-brief.md`: canonical human-readable product brief.
- `evidence.json`: source and claim ledger.
- `decision-pack.md`: concise team-ready summary.
- `html/index.html`: static visual briefing page.
- `html/flashtotype.js`: generic renderer for the page.

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

The generated `index.html` contains a JSON script tag with id `flashtotype-data`. `flashtotype.js` reads that data and renders the page locally without a server.


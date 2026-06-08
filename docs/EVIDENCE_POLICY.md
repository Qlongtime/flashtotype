# Evidence Policy

Flashtotype should make the strength of every important claim visible.

## Claim Labels

- `Source-backed`: the claim is supported by a cited source.
- `Assumption`: the claim is plausible but not externally verified.
- `Needs validation`: the claim is important and currently unsupported.

Use the exact labels above so artifacts and HTML templates stay consistent.

## Source Records

For each `Source-backed` claim, record:

- Source title.
- URL.
- Publisher or author when available.
- Access date.
- Relevant claim.
- Confidence: `High`, `Medium`, or `Low`.
- Short note explaining why the source matters.

## Research Boundaries

- Do not invent sources.
- Do not quote long copyrighted passages.
- If web access is unavailable, label external claims as `Assumption` or `Needs validation`.
- If the user supplies private research, keep it in `flashtotype-workspace/` unless explicitly approved for public docs.

## Confidence Guidance

- `High`: directly supports the claim and comes from a primary or authoritative source.
- `Medium`: supports the claim indirectly or comes from a credible secondary source.
- `Low`: useful signal, but dated, narrow, biased, or weakly connected.


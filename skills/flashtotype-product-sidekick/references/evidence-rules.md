# Evidence Rules

Use evidence to make confidence visible.

## Labels

- `Source-backed`: supported by a cited source.
- `Assumption`: plausible but not externally verified.
- `Needs validation`: important and currently unsupported.

## Source Quality

Prefer:

- Primary sources.
- Current official documentation.
- Government, standards, or regulator pages for legal and compliance claims.
- Credible research, surveys, or market reports.
- Direct competitor pages for competitor claims.

Use secondary sources only when primary sources are unavailable or when they add useful synthesis.

## Required Source Fields

For each source, capture:

- `id`
- `title`
- `url`
- `publisher`
- `accessed_at`
- `notes`

For each claim, capture:

- `id`
- `claim`
- `label`
- `confidence`
- `source_ids`
- `notes`

## Rules

- Do not invent URLs, titles, dates, or source conclusions.
- Do not use stale claims when recency matters without noting the date.
- Do not quote long copyrighted text.
- If web access is unavailable, ask for user-provided sources or mark claims as `Assumption` or `Needs validation`.
- High-stakes legal, medical, financial, privacy, or security claims must be treated as `Needs validation` unless supported by authoritative sources.


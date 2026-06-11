# Project Structure

Flashtotype separates agent-owned files from user-editable working files.

## Source Repository

```text
agent/
  skills/
  board-template/
user-workspace-template/
  current/
    user-editable/
docs/
scripts/
```

- `agent/` is for files agents copy and use as operating instructions or the master board template.
- `user-workspace-template/` is the starter workspace users and agents edit during PM/PO work.
- `docs/` explains public behavior and contracts.
- `scripts/` contains lightweight validation.

## Installed Project

```text
.flashtotype/
  skills/
  board-template/
flashtotype-workspace/
  current/
    user-editable/
    output/
```

## What Users Should Edit

Use `flashtotype-workspace/current/user-editable/` for:

- `flashtotype-brief.md`
- `decision-pack.md`
- `evidence.json`
- `user-journey.md`
- `prototype.md`
- `Design.md`
- `flashtotype-library.md`
- `references/`
- `data/`
- `assets/`

## What Users Should Not Edit

Avoid manual edits in:

- `.flashtotype/`
- `flashtotype-workspace/current/output/`

If the generated board looks wrong, update the source files under `user-editable/` and ask the agent to regenerate the board.

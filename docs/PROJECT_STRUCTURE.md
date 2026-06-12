# Project Structure

Flashtotype separates agent-owned files from user-editable working files.

## Source Repository

```text
agent/
  skills/
  board-template/
user-workspace-template/
  current/
    START-HERE.md
    user-editable/
    output/
      assets/
docs/
scripts/
```

- `agent/` is for files agents copy and use as operating instructions or the master board template.
- `agent/board-template/flashtotype-codex-bridge.mjs` and `start-flashtotype-bridge.*` are optional localhost helpers copied with the static board template.
- `user-workspace-template/` is the starter workspace users and agents edit during PM/PO work.
- `docs/` explains public behavior and contracts.
- `scripts/` contains lightweight validation.

## Installed Project

```text
.agents/
  skills/
    flash-onboard/
    flash-revise/
    flash-present/
    flash-research/
    flash-review/
    flashtotype-product-sidekick/
    flashtotype-presentation-generator/
.flashtotype/
  skills/
    flash-onboard/
    flash-revise/
    flash-present/
    flash-research/
    flash-review/
    flashtotype-product-sidekick/
    flashtotype-presentation-generator/
  board-template/
flashtotype-workspace/
  current/
    START-HERE.md
    user-editable/
    output/
      index.html
      flashtotype.js
      flashtotype-codex-bridge.mjs
      start-flashtotype-bridge.ps1
      start-flashtotype-bridge.cmd
      logo.png
      assets/
```

## What Users Should Edit

Use `flashtotype-workspace/current/user-editable/` for:

- `flashtotype-brief.md`
- `decision-pack.md`
- `evidence.json`
- `user-journey.md`
- `prototype.md`
- `Design.md`
- `presentation.md`
- `flashtotype-library.md`
- `references/`
- `data/`
- `assets/`

Use `flashtotype-workspace/current/START-HERE.md` only as the durable resume guide when reopening the project.

## What Users Should Not Edit

Avoid manual edits in:

- `.agents/skills/`
- `.flashtotype/`
- `flashtotype-workspace/current/output/`

Generated presentation images live under `flashtotype-workspace/current/output/assets/`. If the generated board or slide images look wrong, update the source files under `user-editable/` and ask the agent to regenerate the board.

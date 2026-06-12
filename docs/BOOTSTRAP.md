# Bootstrap Guide

Flashtotype is installed by an agent into a target project.

## Recommended User Prompt

```text
Use the Flashtotype repository to install the Flashtotype PM/PO sidekick into this project. Keep generated work private by default, then interview me and create a decision pack.
```

## Agent Responsibilities

The installing agent must:

- Read the source repository `AGENTS.md`.
- Preserve any existing target project files.
- Copy the Flashtotype skills and board template into `.flashtotype/`.
- Create `flashtotype-workspace/current/user-editable/` for user-editable PM/PO source files.
- Create `flashtotype-workspace/current/output/` for regenerated output users can open.
- Create `flashtotype-workspace/current/output/assets/` for generated local slide images and other run assets.
- Copy `flashtotype-codex-bridge.mjs`, `start-flashtotype-bridge.ps1`, and `start-flashtotype-bridge.cmd` beside the generated HTML as optional local-only Codex helpers.
- For the optional bridge, check whether `node` and `codex` are available when practical, then report missing prerequisites instead of adding a package manager or required backend.
- Add `flashtotype-workspace/` to `.gitignore`.
- Add a project-local `AGENTS.md` section for future agents.

## Target Project Layout

```text
.flashtotype/
  skills/
    flashtotype-product-sidekick/
    flashtotype-presentation-generator/
  board-template/
flashtotype-workspace/
  current/
    user-editable/
      flashtotype-brief.md
      evidence.json
      decision-pack.md
      user-journey.md
      prototype.md
      Design.md
      presentation.md
      flashtotype-library.md
      references/
      data/
      assets/
    output/
      index.html
      flashtotype.js
      flashtotype-codex-bridge.mjs
      start-flashtotype-bridge.ps1
      start-flashtotype-bridge.cmd
      logo.png
      assets/
```

`flashtotype-workspace/` is private by default. Users should edit files under `user-editable/`. Users should open `output/index.html` to see the board. Agents should regenerate files under `output/` from the user-editable sources, and save generated presentation images under `output/assets/`.

The optional local Codex bridge is easiest to start from the board itself: inspect the visible agent control prompt, optionally add a user request, click `Run prompt`, copy the command from the connection popup, and keep that terminal open. The static board is still fully usable without the bridge through editable/copyable prompts.

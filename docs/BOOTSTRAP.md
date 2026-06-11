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
- Copy the Flashtotype skill and board template into `.flashtotype/`.
- Create `flashtotype-workspace/current/user-editable/` for user-editable PM/PO source files.
- Create `flashtotype-workspace/current/output/` for regenerated output users can open.
- Add `flashtotype-workspace/` to `.gitignore`.
- Add a project-local `AGENTS.md` section for future agents.

## Target Project Layout

```text
.flashtotype/
  skills/flashtotype-product-sidekick/
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
      flashtotype-library.md
      references/
      data/
      assets/
    output/
      index.html
      flashtotype.js
      logo.png
```

`flashtotype-workspace/` is private by default. Users should edit files under `user-editable/`. Users should open `output/index.html` to see the board. Agents should regenerate files under `output/` from the user-editable sources.

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
- Copy the Flashtotype skill and templates into `.flashtotype/`.
- Create `flashtotype-workspace/current/` for generated artifacts.
- Add `flashtotype-workspace/` to `.gitignore`.
- Add a project-local `AGENTS.md` section for future agents.

## Target Project Layout

```text
.flashtotype/
  skills/flashtotype-product-sidekick/
  templates/workspace/
  templates/html/
flashtotype-workspace/
  current/
    flashtotype-brief.md
    evidence.json
    decision-pack.md
    html/
      index.html
      flashtotype.js
```

`flashtotype-workspace/` is private by default. The user may later copy sanitized outputs into tracked documentation.


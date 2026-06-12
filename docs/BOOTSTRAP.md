# Bootstrap Guide

Flashtotype is installed by an agent into a target project.

## Recommended User Prompt

```text
Use the Flashtotype repository at https://github.com/Qlongtime/flashtotype.git to install the Flashtotype PM/PO sidekick into this project.

First, access the repository at that URL (by cloning it to a temporary directory or fetching the files) and read its "AGENTS.md" file to learn how Flashtotype works. Follow the installation guidelines in "AGENTS.md" to set up the workspace folders, copy the agent skills and board templates, and update our target .gitignore. Keep all generated work private by default.

Do not stop after installation and do not ask me to restart Codex before onboarding. In this same conversation, read `.flashtotype/skills/flash-onboard/SKILL.md` directly and begin the product interview. A restart may refresh the skill menu later, but it is not required for the first run.
```

## Agent Responsibilities

The installing agent must:

- Read the source repository `AGENTS.md`.
- Preserve any existing target project files.
- Merge the Flashtotype skills into `.agents/skills/` for Codex project discovery.
- Copy the Flashtotype skills and board template into `.flashtotype/`.
- Create `flashtotype-workspace/current/user-editable/` for user-editable PM/PO source files.
- Create `flashtotype-workspace/current/output/` for regenerated output users can open.
- Create `flashtotype-workspace/current/START-HERE.md` as the persistent recovery guide.
- Create `flashtotype-workspace/current/output/assets/` for generated local slide images and other run assets.
- Copy `flashtotype-codex-bridge.mjs`, `start-flashtotype-bridge.ps1`, and `start-flashtotype-bridge.cmd` beside the generated HTML as optional local-only Codex helpers.
- For the optional bridge, check whether `node` and `codex` are available when practical, then report missing prerequisites instead of adding a package manager or required backend.
- Add `flashtotype-workspace/` to `.gitignore`.
- Add a project-local `AGENTS.md` section for future agents.
- Read `.flashtotype/skills/flash-onboard/SKILL.md` directly and begin the first interview in the same conversation.
- Never make restart or skill-menu refresh a prerequisite for first-run onboarding.

## First-Run Handoff Contract

Installation is not complete when the files have merely been copied. The installing agent must:

1. Confirm the required folders and files exist.
2. Read the installed `flash-onboard` skill directly from `.flashtotype/skills/`.
3. Briefly report that setup is complete.
4. Ask the first focused product interview questions in the same response.

The agent must not end with only "restart Codex and run the skill." Restart is an optional discovery refresh for future sessions, not a required workflow step.

## Target Project Layout

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

The first onboarding interview starts automatically in the installation conversation. In later sessions, use `$flash-onboard`, `$flash-revise`, `$flash-present`, `$flash-research`, or `$flash-review` for the matching job. If a skill is not visible in the selector, the agent should read its copy under `.flashtotype/skills/` directly. Restarting Codex is optional.

The optional local Codex bridge is easiest to start from the board itself: inspect the visible agent control prompt, optionally add a user request, click `Run prompt`, copy the command from the connection popup, and keep that terminal open. The static board is still fully usable without the bridge through editable/copyable prompts.

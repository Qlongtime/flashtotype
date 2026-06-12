# Start Flashtotype

The installing agent should begin the first product interview immediately. Restarting Codex is not required.

If you reopened this project or the previous installation conversation ended, send:

```text
Use $flash-onboard to start or resume this project's Flashtotype discovery workflow.
```

If `$flash-onboard` is not visible in the skill selector yet, send:

```text
Read `.flashtotype/skills/flash-onboard/SKILL.md` directly and follow it to start or resume the Flashtotype product interview. Do not require a restart.
```

Use the command that matches the next job:

| Command | Purpose |
| --- | --- |
| `$flash-revise` | Apply a focused change and regenerate affected artifacts. |
| `$flash-present` | Create or refresh the stakeholder presentation. |
| `$flash-research` | Research a bounded question and update the evidence ledger. |
| `$flash-review` | Audit sharing readiness without editing by default. |

If any command is missing from the selector, ask Codex to read `.flashtotype/skills/<command-name>/SKILL.md` directly and follow it.

Editable source files live in `user-editable/`. Open `output/index.html` to view the generated board.

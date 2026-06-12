# Output

Files in this folder are generated from `../user-editable/`.

Open `index.html` in a browser to see the Flashtotype board. Keep `logo.png`, `flashtotype.js`, `flashtotype-codex-bridge.mjs`, `start-flashtotype-bridge.ps1`, `start-flashtotype-bridge.cmd`, and the `assets/` folder beside `index.html` when regenerating or moving the output.

Generated presentation images should be saved under `assets/` and referenced from board JSON with local paths such as `assets/presentation-slide-01.png`.

To optionally send board prompts to local Codex, inspect the visible agent control prompt, optionally add a user request, and click `Run prompt`. If the bridge is offline, the board shows a copyable command like this:

```text
powershell -NoProfile -ExecutionPolicy Bypass -File ".\start-flashtotype-bridge.ps1" -Token "<page-generated-token>"
```

Run that command in a terminal and keep it open. The board still works without the bridge through editable/copyable prompts.

Users can view these files, but should avoid hand-editing them. Update the source files under `user-editable/` and ask the agent to regenerate output.

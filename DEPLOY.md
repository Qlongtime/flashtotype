# Deploy

Flashtotype has no application deployment in v1.

The generated briefing page is static HTML and JavaScript. Open it directly:

```text
flashtotype-workspace/current/output/index.html
```

For public demos, copy a sanitized generated `html/` folder to any static host such as GitHub Pages, Netlify, Vercel static output, or an internal file share.

The optional `flashtotype-codex-bridge.mjs` and `start-flashtotype-bridge.*` files are for local trusted use only. Do not expose them from a public host or run the bridge on a shared network interface.

Do not deploy private generated research unless the user has reviewed and approved it for sharing.

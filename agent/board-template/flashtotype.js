(function () {
  const REQUIRED_PAGE_IDS = ["home", "journey", "prototype", "design", "presentation", "library"];
  const MENU_EXCLUDED_PAGE_IDS = new Set(["presentation"]);
  const RIGHT_MOUSE_BUTTON = 2;
  const RIGHT_MOUSE_BUTTON_MASK = 2;
  const ZOOM_MIN = 0.55;
  const ZOOM_MAX = 1.25;
  const WHEEL_ZOOM_STEP = 0.08;
  const VISUAL_LAYOUTS = new Set(["split-right", "split-left", "full-bleed", "none"]);
  const CODEX_BRIDGE_DEFAULT_URL = "http://127.0.0.1:4777";
  const CODEX_BRIDGE_HEALTH_INTERVAL_MS = 3000;
  const CODEX_BRIDGE_FETCH_TIMEOUT_MS = 1400;
  const CODEX_RUN_POLL_INTERVAL_MS = 1400;
  const CODEX_BRIDGE_PROVIDERS = new Set(["exec", "app-server"]);
  const CODEX_BRIDGE_SANDBOXES = new Set(["read-only", "workspace-write"]);
  const PAN_EXCLUDED_SELECTOR = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "[role='button']",
    ".page-rail",
    ".topbar",
    ".presenter-overlay",
    ".zoom-controls"
  ].join(",");
  const labelClass = {
    "Source-backed": "source-backed",
    "Assumption": "assumption",
    "Needs validation": "needs-validation"
  };

  const PAGE_ICONS = {
    home: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    journey: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M6 7.5V12a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v1.5"/></svg>`,
    prototype: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="4" rx="2"/><line x1="2" x2="22" y1="9" y2="9"/><line x1="6" x2="6" y1="6.5" y2="6.5" stroke-width="3"/><line x1="10" x2="10" y1="6.5" y2="6.5" stroke-width="3"/></svg>`,
    design: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>`,
    presentation: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M12 16v4"/><path d="M8 20h8"/><path d="m8 10 3 3 5-6"/></svg>`,
    library: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h10"/></svg>`
  };

  const DEFAULT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  const READ_FULL_ICON = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`;

  const state = {
    activePageId: "",
    zoom: 1
  };

  const pan = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0
  };

  const presenter = {
    active: false,
    slides: [],
    index: 0,
    ownsFullscreen: false
  };

  const codexBridge = {
    config: null,
    online: false,
    health: null,
    token: "",
    pendingPromptNode: null,
    timer: null
  };

  function readData() {
    const node = document.getElementById("flashtotype-data");
    if (!node) return { pages: [] };
    try {
      const data = JSON.parse(node.textContent);
      data.pages = Array.isArray(data.pages) ? data.pages : [];
      data.codexBridge = normalizeCodexBridgeConfig(data.codexBridge);
      return data;
    } catch (error) {
      console.error("Invalid Flashtotype JSON data", error);
      return {
        projectName: "Invalid board data",
        subtitle: "Fix the JSON inside the flashtotype-data script tag.",
        status: "Invalid",
        codexBridge: normalizeCodexBridgeConfig({ enabled: false }),
        sourceFiles: [],
        pages: []
      };
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeColor(value) {
    const color = String(value || "").trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return color;
    if (/^rgba?\([\d\s.,%]+\)$/i.test(color)) return color;
    if (/^hsla?\([\d\s.,%]+\)$/i.test(color)) return color;
    return "#eef3f6";
  }

  function badge(label) {
    const klass = labelClass[label] || "needs-validation";
    return `<span class="badge ${klass}">${escapeHtml(label || "Needs validation")}</span>`;
  }

  function list(items, ordered) {
    if (!Array.isArray(items) || items.length === 0) {
      return '<p class="empty">No items added yet.</p>';
    }
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
  }

  function plainList(items) {
    if (!Array.isArray(items) || items.length === 0) return "";
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function safeHref(value) {
    const href = String(value || "").trim();
    if (!href) return "";
    if (/^(https?:|mailto:)/i.test(href)) return href;
    if (/^[./#][^<>"']*$/.test(href)) return href;
    return "";
  }

  function renderInlineMarkdown(value) {
    let text = escapeHtml(value);
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      const safe = safeHref(href);
      return safe ? `<a href="${escapeHtml(safe)}" target="_blank" rel="noreferrer">${label}</a>` : label;
    });
    return text;
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let paragraph = [];
    let listItems = [];
    let ordered = false;
    let quoteLines = [];
    let codeLines = [];
    let inCode = false;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (!listItems.length) return;
      const tag = ordered ? "ol" : "ul";
      html.push(`<${tag}>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${tag}>`);
      listItems = [];
    };
    const flushQuote = () => {
      if (!quoteLines.length) return;
      html.push(`<blockquote>${quoteLines.map((line) => `<p>${renderInlineMarkdown(line)}</p>`).join("")}</blockquote>`);
      quoteLines = [];
    };
    const flushBlocks = () => {
      flushParagraph();
      flushList();
      flushQuote();
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (/^```/.test(trimmed)) {
        if (inCode) {
          html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
          codeLines = [];
          inCode = false;
        } else {
          flushBlocks();
          inCode = true;
        }
        return;
      }
      if (inCode) {
        codeLines.push(line);
        return;
      }
      if (!trimmed) {
        flushBlocks();
        return;
      }
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        flushBlocks();
        const level = Math.min(headingMatch[1].length + 1, 5);
        html.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
        return;
      }
      const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
      const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
      if (unorderedMatch || orderedMatch) {
        flushParagraph();
        flushQuote();
        const nextOrdered = Boolean(orderedMatch);
        if (listItems.length && ordered !== nextOrdered) flushList();
        ordered = nextOrdered;
        listItems.push((orderedMatch || unorderedMatch)[1]);
        return;
      }
      const quoteMatch = trimmed.match(/^>\s?(.+)$/);
      if (quoteMatch) {
        flushParagraph();
        flushList();
        quoteLines.push(quoteMatch[1]);
        return;
      }
      flushList();
      flushQuote();
      paragraph.push(trimmed);
    });

    if (inCode) {
      html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    }
    flushBlocks();
    return html.join("") || '<p class="empty">No full content added yet.</p>';
  }

  function blockMarkdown(block) {
    const fullMarkdown = String(block.fullMarkdown || block.markdown || "").trim();
    if (fullMarkdown) return fullMarkdown;
    const lines = [`## ${block.title || "Overview section"}`];
    if (block.body) lines.push("", block.body);
    if (Array.isArray(block.items) && block.items.length) {
      lines.push("", ...block.items.map((item) => `- ${item}`));
    }
    return lines.join("\n");
  }

  function blockSourceLabel(block) {
    return [block.sourceFile, block.sourceSection].filter(Boolean).join(" - ");
  }

  function isLocalRelativePath(value) {
    const src = String(value || "").trim();
    if (!src) return false;
    if (/^(https?:)?\/\//i.test(src)) return false;
    if (/^(data|file|javascript):/i.test(src)) return false;
    if (/^[a-z]:[\\/]/i.test(src)) return false;
    if (src.startsWith("/") || src.startsWith("\\") || src.includes("..")) return false;
    return true;
  }

  function normalizeBridgeProvider(value) {
    const provider = String(value || "exec").trim();
    return CODEX_BRIDGE_PROVIDERS.has(provider) ? provider : "exec";
  }

  function normalizeBridgeSandbox(value) {
    const sandbox = String(value || "read-only").trim();
    return CODEX_BRIDGE_SANDBOXES.has(sandbox) ? sandbox : "read-only";
  }

  function isLoopbackBridgeUrl(value) {
    try {
      const url = new URL(String(value || CODEX_BRIDGE_DEFAULT_URL));
      return url.protocol === "http:"
        && ["127.0.0.1", "localhost", "::1", "[::1]"].includes(url.hostname);
    } catch {
      return false;
    }
  }

  function normalizeCodexBridgeConfig(rawConfig) {
    const raw = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
    const requestedUrl = String(raw.url || CODEX_BRIDGE_DEFAULT_URL).trim();
    const safeUrl = isLoopbackBridgeUrl(requestedUrl) ? requestedUrl : CODEX_BRIDGE_DEFAULT_URL;
    return {
      enabled: raw.enabled !== false,
      url: safeUrl.replace(/\/+$/, ""),
      defaultProvider: normalizeBridgeProvider(raw.defaultProvider),
      defaultSandbox: normalizeBridgeSandbox(raw.defaultSandbox)
    };
  }

  function normalizeVisual(visual) {
    const raw = visual && typeof visual === "object" ? visual : {};
    const prompt = String(raw.prompt || "").trim();
    const src = isLocalRelativePath(raw.src) ? String(raw.src).trim() : "";
    const requestedLayout = String(raw.layout || "").trim();
    const layout = VISUAL_LAYOUTS.has(requestedLayout)
      ? requestedLayout
      : (src || prompt ? "split-right" : "none");
    return {
      layout,
      prompt,
      src,
      alt: String(raw.alt || "").trim(),
      status: String(raw.status || (src ? "generated" : (prompt ? "prompt-only" : "none"))).trim()
    };
  }

  function visualClass(visual, prefix) {
    const hasVisual = visual.layout !== "none" && (visual.src || visual.prompt);
    return [
      hasVisual ? "has-visual" : "is-text-only",
      `${prefix}-visual-${visual.layout}`
    ].join(" ");
  }

  function renderSlideVisual(visual, mode) {
    if (visual.layout === "none" || (!visual.src && !visual.prompt)) return "";
    const status = visual.status === "generated" ? "Generated visual" : "Image prompt";
    const alt = visual.alt || "Slide visual";
    if (visual.src) {
      return `
        <figure class="${mode}-visual">
          <img src="${escapeHtml(visual.src)}" alt="${escapeHtml(alt)}">
          ${mode === "slide" ? `<figcaption>${escapeHtml(status)}</figcaption>` : ""}
        </figure>
      `;
    }
    return `
      <div class="${mode}-visual visual-placeholder" role="img" aria-label="${escapeHtml(alt)}">
        <span>${escapeHtml(status)}</span>
        <p>${escapeHtml(visual.prompt || "No image prompt added yet.")}</p>
      </div>
    `;
  }

  function sourceStrip(page) {
    const files = page.sourceFiles || window.FLASHTOTYPE_DATA.sourceFiles || [];
    const chips = files.map((file) => `<span class="source-chip">${escapeHtml(file)}</span>`).join("");
    return `
      <div class="source-strip">
        <span class="source-label">Sources</span>
        ${chips || '<span class="source-chip">No source files mapped</span>'}
      </div>
    `;
  }

  function renderPageMenu(data) {
    const listNode = byId("page-list");
    const highlightedPageId = state.activePageId === "presentation" ? "home" : state.activePageId;
    const visiblePages = data.pages.filter((page) => !page.hiddenFromMenu && !MENU_EXCLUDED_PAGE_IDS.has(page.id));
    listNode.innerHTML = visiblePages.map((page) => `
      <button class="page-button" type="button" data-page-id="${escapeHtml(page.id)}" aria-current="${page.id === highlightedPageId ? "page" : "false"}">
        <span class="page-index">${PAGE_ICONS[page.id] || DEFAULT_ICON}</span>
        <span>
          <span class="page-label">${escapeHtml(page.label || page.title || page.id)}</span>
          <span class="page-source">${escapeHtml((page.sourceFiles || []).join(", "))}</span>
        </span>
      </button>
    `).join("");

    listNode.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        setPage(button.dataset.pageId);
      });
    });
  }

  function renderHeader(data) {
    byId("project-title").textContent = data.projectName || "Project board";
    byId("project-subtitle").textContent = data.subtitle || "PM/PO visual workspace";
    byId("board-status").textContent = data.status || "Draft";
  }

  function renderMetricRow(metrics) {
    if (!Array.isArray(metrics) || metrics.length === 0) return "";
    return `
      <div class="metric-row">
        ${metrics.map((metric) => `
          <div class="metric">
            <span>${escapeHtml(metric.label)}</span>
            <strong>${escapeHtml(metric.value)}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderHome(page) {
    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    const evidence = Array.isArray(page.evidence) ? page.evidence : [];
    return `
      <div class="page-frame is-home">
        ${sourceStrip(page)}
        <section class="notion-sheet">
          <div class="overview-header">
            <div>
              <h1 class="board-title">${escapeHtml(page.title || "Project Overview")}</h1>
              <p class="board-summary">${escapeHtml(page.summary || "")}</p>
            </div>
            <button class="mode-switch-button" type="button" data-page-target="presentation" aria-label="Open presentation mode">
              <span aria-hidden="true">${PAGE_ICONS.presentation}</span>
              Presentation mode
            </button>
          </div>
          ${renderMetricRow(page.metrics)}
          <div class="board-grid">
            ${blocks.map((block, index) => `
              <article class="tile span-6">
                <div class="tile-header">
                  <h2>${escapeHtml(block.title)}</h2>
                  <button class="read-full-button" type="button" data-read-full="${index}" aria-label="Read full ${escapeHtml(block.title || "section")}" title="Read full section">
                    ${READ_FULL_ICON}
                  </button>
                </div>
                <p>${escapeHtml(block.body)}</p>
                ${list(block.items)}
              </article>
            `).join("")}
            <article class="tile span-7">
              <h2>Evidence snapshot</h2>
              ${evidence.length ? evidence.map((item) => `
                <div class="evidence-row">
                  <div>${badge(item.label)}</div>
                  <div>
                    <strong>${escapeHtml(item.claim)}</strong>
                    <p>${escapeHtml(item.note || item.sourceTitle || "No note added.")}</p>
                  </div>
                </div>
              `).join("") : '<p class="empty">No evidence added yet.</p>'}
            </article>
            <article class="tile span-5">
              <h2>Next actions</h2>
              ${list(page.nextActions, true)}
            </article>
          </div>
        </section>
      </div>
    `;
  }

  function nodeCenter(node) {
    return {
      x: toNumber(node.x, 0) + 115,
      y: toNumber(node.y, 0) + 58
    };
  }

  function renderJourney(page) {
    const nodes = Array.isArray(page.nodes) ? page.nodes : [];
    const links = Array.isArray(page.links) ? page.links : [];
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const svgLinks = links.map((link) => {
      const from = nodeMap.get(link.from);
      const to = nodeMap.get(link.to);
      if (!from || !to) return "";
      const start = nodeCenter(from);
      const end = nodeCenter(to);
      return `
        <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="#2f3a42" stroke-width="2" marker-end="url(#arrow)" />
        ${link.label ? `<text x="${(start.x + end.x) / 2}" y="${(start.y + end.y) / 2 - 10}" class="svg-label">${escapeHtml(link.label)}</text>` : ""}
      `;
    }).join("");

    return `
      <div class="page-frame is-canvas">
        ${sourceStrip(page)}
        <h1 class="board-title">${escapeHtml(page.title || "User Journey Flow")}</h1>
        <p class="board-summary">${escapeHtml(page.summary || "")}</p>
        <section class="journey-canvas">
          <svg class="connector-layer" viewBox="0 0 1540 900" aria-hidden="true">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f3a42"></path>
              </marker>
            </defs>
            <style>.svg-label{font:700 13px Inter,system-ui,sans-serif;fill:#64717b;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round;}</style>
            ${svgLinks}
          </svg>
          ${nodes.map((node) => `
            <article class="journey-node ${node.tone === "action" ? "is-action" : ""} ${node.tone === "system" ? "is-system" : ""}" style="left:${toNumber(node.x, 0)}px;top:${toNumber(node.y, 0)}px">
              <h3>${escapeHtml(node.title)}</h3>
              <p>${escapeHtml(node.body)}</p>
            </article>
          `).join("")}
        </section>
      </div>
    `;
  }

  function prototypeTone(value) {
    const tone = String(value || "neutral").trim().toLowerCase();
    return ["neutral", "accent", "success", "warning", "danger"].includes(tone) ? tone : "neutral";
  }

  function prototypeItem(item) {
    if (typeof item === "string") {
      return `<li><span>${escapeHtml(item)}</span></li>`;
    }
    const value = item && typeof item === "object" ? item : {};
    return `
      <li>
        <div>
          <strong>${escapeHtml(value.title || value.label || "")}</strong>
          ${value.body ? `<span>${escapeHtml(value.body)}</span>` : ""}
        </div>
        ${value.meta || value.status ? `<small>${escapeHtml(value.meta || value.status)}</small>` : ""}
      </li>
    `;
  }

  function renderPrototypeElement(element) {
    const item = element && typeof element === "object" ? element : {};
    const type = String(item.type || "text").trim().toLowerCase();
    const tone = prototypeTone(item.tone);
    const title = item.title || item.label || "";
    const body = item.body || item.value || item.placeholder || "";

    if (type === "field") {
      return `
        <div class="prototype-element prototype-field tone-${tone}">
          ${title ? `<span class="prototype-element-label">${escapeHtml(title)}</span>` : ""}
          <div class="prototype-field-value ${item.value ? "has-value" : ""}">${escapeHtml(body || "Add value")}</div>
          ${item.meta || item.status ? `<small>${escapeHtml(item.meta || item.status)}</small>` : ""}
        </div>
      `;
    }

    if (type === "list") {
      const items = Array.isArray(item.items) ? item.items : [];
      return `
        <div class="prototype-element prototype-list tone-${tone}">
          ${title ? `<span class="prototype-element-label">${escapeHtml(title)}</span>` : ""}
          ${items.length ? `<ul>${items.map(prototypeItem).join("")}</ul>` : '<p class="prototype-empty">No items added.</p>'}
        </div>
      `;
    }

    if (type === "card") {
      const tags = Array.isArray(item.tags) ? item.tags : [];
      return `
        <div class="prototype-element prototype-card tone-${tone}">
          ${item.eyebrow ? `<span class="prototype-element-label">${escapeHtml(item.eyebrow)}</span>` : ""}
          ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
          ${body ? `<p>${escapeHtml(body)}</p>` : ""}
          ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ""}
          ${tags.length ? `<div class="prototype-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        </div>
      `;
    }

    if (type === "notice") {
      return `
        <div class="prototype-element prototype-notice tone-${tone}">
          ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
          ${body ? `<p>${escapeHtml(body)}</p>` : ""}
        </div>
      `;
    }

    if (type === "actions") {
      const primary = item.primary || title || "Continue";
      return `
        <div class="prototype-element prototype-actions">
          <button class="prototype-action-primary" type="button" tabindex="-1">${escapeHtml(primary)}</button>
          ${item.secondary ? `<button class="prototype-action-secondary" type="button" tabindex="-1">${escapeHtml(item.secondary)}</button>` : ""}
        </div>
      `;
    }

    if (type === "progress") {
      const value = Math.max(0, Math.min(100, toNumber(item.value, 0)));
      return `
        <div class="prototype-element prototype-progress tone-${tone}">
          <div><span>${escapeHtml(title || "Progress")}</span><strong>${escapeHtml(item.displayValue || `${value}%`)}</strong></div>
          <div class="prototype-progress-track"><span style="width:${value}%"></span></div>
        </div>
      `;
    }

    return `
      <div class="prototype-element prototype-text tone-${tone}">
        ${item.eyebrow ? `<span class="prototype-element-label">${escapeHtml(item.eyebrow)}</span>` : ""}
        ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
        ${body ? `<p>${escapeHtml(body)}</p>` : ""}
      </div>
    `;
  }

  function renderPrototype(page) {
    const screens = Array.isArray(page.screens) ? page.screens : [];
    const notes = Array.isArray(page.notes) ? page.notes : [];
    return `
      <div class="page-frame is-canvas">
        ${sourceStrip(page)}
        <h1 class="board-title">${escapeHtml(page.title || "Prototype Workspace")}</h1>
        <p class="board-summary">${escapeHtml(page.summary || "")}</p>
        <section class="prototype-canvas">
          ${screens.map((screen) => {
            const elements = Array.isArray(screen.elements) ? screen.elements : [];
            const navigation = Array.isArray(screen.navigation) ? screen.navigation : [];
            const device = screen.device === "desktop" ? "desktop" : "mobile";
            const defaultWidth = device === "desktop" ? 520 : 320;
            const width = Math.max(280, Math.min(720, toNumber(screen.width, defaultWidth)));
            return `
              <article class="screen-frame is-${device}" style="left:${toNumber(screen.x, 0)}px;top:${toNumber(screen.y, 0)}px;--prototype-screen-width:${width}px">
                <div class="screen-top">
                  <span>${escapeHtml(screen.state || "Draft")}</span>
                  <span>${escapeHtml(screen.step || device)}</span>
                </div>
                <div class="prototype-screen-body">
                  <header class="prototype-screen-heading">
                    ${screen.eyebrow ? `<span>${escapeHtml(screen.eyebrow)}</span>` : ""}
                    <h3>${escapeHtml(screen.title || "Prototype screen")}</h3>
                    ${screen.body ? `<p>${escapeHtml(screen.body)}</p>` : ""}
                  </header>
                  <div class="prototype-elements">
                    ${elements.length
                      ? elements.map(renderPrototypeElement).join("")
                      : renderPrototypeElement({ type: "notice", title: "Screen content needed", body: screen.body || "Add structured prototype elements from prototype.md.", tone: "warning" })}
                  </div>
                  ${navigation.length ? `
                    <nav class="prototype-navigation" aria-label="Prototype navigation">
                      ${navigation.map((item) => `<span class="${item.active ? "is-active" : ""}">${escapeHtml(item.label || item)}</span>`).join("")}
                    </nav>
                  ` : ""}
                </div>
              </article>
            `;
          }).join("")}
          ${notes.map((note) => `
            <article class="sticky ${escapeHtml(note.tone || "pink")}" style="left:${toNumber(note.x, 0)}px;top:${toNumber(note.y, 0)}px">
              <h3>${escapeHtml(note.title)}</h3>
              <p>${escapeHtml(note.body)}</p>
            </article>
          `).join("")}
        </section>
      </div>
    `;
  }

  function renderDesign(page) {
    const colors = Array.isArray(page.colors) ? page.colors : [];
    return `
      <div class="page-frame">
        ${sourceStrip(page)}
        <h1 class="board-title">${escapeHtml(page.title || "Design System")}</h1>
        <p class="board-summary">${escapeHtml(page.summary || "")}</p>
        <div class="board-grid">
          <section class="tile span-12">
            <h2>Theme colors</h2>
            <div class="design-swatches">
              ${colors.map((color) => `
                <div class="swatch">
                  <div class="swatch-color" style="background:${safeColor(color.value)}"></div>
                  <div class="swatch-body">
                    <strong>${escapeHtml(color.name)}</strong>
                    <span>${escapeHtml(color.value)}</span>
                    <span>${escapeHtml(color.usage)}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
          <section class="tile span-6">
            <h2>Typography</h2>
            ${list(page.typography)}
          </section>
          <section class="tile span-6">
            <h2>Components</h2>
            ${list(page.components)}
          </section>
        </div>
      </div>
    `;
  }

  function renderBoardSlide(slide) {
    const visual = normalizeVisual(slide.visual);
    const visualMarkup = renderSlideVisual(visual, "slide");
    return `
      <article class="slide-card ${visualClass(visual, "slide")}">
        <div class="slide-kicker">
          <span>${escapeHtml(slide.eyebrow || "")}</span>
          ${badge(slide.evidenceLabel)}
        </div>
        <div class="slide-content">
          ${visualMarkup}
          <div class="slide-body">
            <h2>${escapeHtml(slide.title || "Untitled slide")}</h2>
            <p>${escapeHtml(slide.body || "")}</p>
            ${list(slide.bullets)}
          </div>
        </div>
        <footer class="slide-footer">
          <span>${escapeHtml(slide.sourceNote || "No source note added.")}</span>
        </footer>
        ${slide.speakerNotes ? `
          <details class="speaker-notes">
            <summary>Speaker notes</summary>
            <p>${escapeHtml(slide.speakerNotes)}</p>
          </details>
        ` : ""}
      </article>
    `;
  }

  function renderPresentation(page) {
    const slides = Array.isArray(page.slides) ? page.slides : [];
    return `
      <div class="page-frame is-presentation">
        <div class="presentation-actions">
          <button class="mode-switch-button mode-return-button" type="button" data-page-target="home" aria-label="Return to overview mode">
            <span aria-hidden="true">&lt;</span>
            Overview mode
          </button>
          <button class="present-button" type="button" data-present-deck aria-label="Present slide deck">
            <span aria-hidden="true"></span>
            Present
          </button>
        </div>
        ${sourceStrip(page)}
        <section class="presentation-hero">
          <div>
            <h1 class="board-title">${escapeHtml(page.title || "Stakeholder Presentation")}</h1>
            <p class="board-summary">${escapeHtml(page.summary || "")}</p>
          </div>
          <div class="presentation-meta" aria-label="Presentation metadata">
            <div>
              <span>Audience</span>
              <strong>${escapeHtml(page.audience || "Stakeholders")}</strong>
            </div>
            <div>
              <span>Decision</span>
              <strong>${escapeHtml(page.decision || "Decision needed")}</strong>
            </div>
          </div>
        </section>
        ${page.prompt ? renderSkillPrompt({ prompt: page.prompt }) : ""}
        <section class="presentation-deck" aria-label="Presentation slides">
          ${slides.length ? slides.map(renderBoardSlide).join("") : '<p class="empty">No slides added yet.</p>'}
        </section>
      </div>
    `;
  }

  function renderSkillPrompt(skill) {
    if (!skill.prompt) return "";
    const config = codexBridge.config || normalizeCodexBridgeConfig();
    const defaultProvider = normalizeBridgeProvider(config.defaultProvider);
    const defaultSandbox = normalizeBridgeSandbox(config.defaultSandbox);
    return `
      <div class="skill-prompt" data-codex-prompt>
        <div class="prompt-toolbar">
          <span>Agent prompt</span>
          <button class="copy-prompt-button" type="button" data-copy-prompt aria-label="Copy merged agent prompt" title="Copy merged agent prompt"></button>
        </div>
        <details class="prompt-control" open>
          <summary>Agent control prompt</summary>
          <div class="prompt-panel">
            <pre class="prompt-code" data-prompt-fixed><code>${escapeHtml(skill.prompt)}</code></pre>
          </div>
        </details>
        <details class="prompt-compose">
          <summary>Optional user request</summary>
          <label>
            <span>Additional instructions</span>
            <textarea class="prompt-input" data-prompt-addon aria-label="Add optional instructions to the fixed agent prompt" placeholder="Describe anything extra you want Flashtotype to run, update, research, or validate."></textarea>
          </label>
        </details>
        ${config.enabled ? `
          <div class="prompt-compose-actions">
            <button class="codex-send-button" type="button" data-send-codex>Run prompt</button>
            <button class="codex-cancel-button" type="button" data-cancel-codex hidden>Cancel</button>
          </div>
        ` : ""}
        ${config.enabled ? `<div class="codex-bridge-panel" data-codex-bridge-panel>
          <div class="codex-bridge-status" data-codex-status>Local Codex bridge offline</div>
          <div class="codex-bridge-fields">
            <label>
              <span>Provider</span>
              <select data-codex-provider>
                <option value="exec"${defaultProvider === "exec" ? " selected" : ""}>codex exec</option>
                <option value="app-server"${defaultProvider === "app-server" ? " selected" : ""}>app-server</option>
              </select>
            </label>
            <label>
              <span>Sandbox</span>
              <select data-codex-sandbox>
                <option value="read-only"${defaultSandbox === "read-only" ? " selected" : ""}>read-only</option>
                <option value="workspace-write"${defaultSandbox === "workspace-write" ? " selected" : ""}>workspace-write</option>
              </select>
            </label>
          </div>
          <pre class="codex-output" data-codex-output hidden></pre>
        </div>` : ""}
      </div>
    `;
  }

  function renderLibrary(page) {
    const items = Array.isArray(page.items) ? page.items : [];
    const skills = Array.isArray(page.skills) ? page.skills : [];
    return `
      <div class="page-frame">
        ${sourceStrip(page)}
        <h1 class="board-title">${escapeHtml(page.title || "Flashtotype Library")}</h1>
        <p class="board-summary">${escapeHtml(page.summary || "")}</p>
        <section class="skill-grid" aria-label="Installed skills and active workflow modules">
          ${skills.length ? skills.map((skill) => `
            <article class="skill-card">
              <div class="skill-meta">
                <span class="badge source-backed">${escapeHtml(skill.type || "Installed")}</span>
                <span class="badge assumption">${escapeHtml(skill.status || "Active")}</span>
              </div>
              <h3>${escapeHtml(skill.name)}</h3>
              <code class="skill-path">${escapeHtml(skill.path || "")}</code>
              <p>${escapeHtml(skill.description || "")}</p>
              ${(skill.usedFor || []).map((tag) => `<span class="badge assumption">${escapeHtml(tag)}</span>`).join(" ")}
              ${renderSkillPrompt(skill)}
            </article>
          `).join("") : '<p class="empty">No installed skills mapped yet.</p>'}
        </section>
        <section class="library-grid">
          ${items.map((item) => `
            <article class="library-card">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
              ${(item.tags || []).map((tag) => `<span class="badge assumption">${escapeHtml(tag)}</span>`).join(" ")}
            </article>
          `).join("")}
        </section>
      </div>
    `;
  }

  function renderFallback(page) {
    return `
      <div class="page-frame is-home">
        ${sourceStrip(page)}
        <section class="notion-sheet">
          <h1 class="board-title">${escapeHtml(page.title || page.label || "Untitled page")}</h1>
          <p class="board-summary">${escapeHtml(page.summary || "No renderer is configured for this page type.")}</p>
        </section>
      </div>
    `;
  }

  function renderPage(page) {
    if (!page) return;
    const stage = byId("board-stage");
    if (page.type === "home") stage.innerHTML = renderHome(page);
    else if (page.type === "journey") stage.innerHTML = renderJourney(page);
    else if (page.type === "prototype") stage.innerHTML = renderPrototype(page);
    else if (page.type === "design") stage.innerHTML = renderDesign(page);
    else if (page.type === "presentation") stage.innerHTML = renderPresentation(page);
    else if (page.type === "library") stage.innerHTML = renderLibrary(page);
    else stage.innerHTML = renderFallback(page);
    renderPageMenu(window.FLASHTOTYPE_DATA);
    refreshCodexBridgePanels();
  }

  function setPage(pageId) {
    const data = window.FLASHTOTYPE_DATA;
    const page = data.pages.find((item) => item.id === pageId) || data.pages[0];
    if (!page) return;
    state.activePageId = page.id;
    window.location.hash = page.id;
    renderPage(page);
  }

  function setZoom(nextZoom) {
    state.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextZoom));
    byId("board-stage").style.transform = `scale(${state.zoom})`;
    byId("zoom-label").textContent = `${Math.round(state.zoom * 100)}%`;
    return state.zoom;
  }

  function isNarrowViewport() {
    return window.matchMedia("(max-width: 560px)").matches
      || window.innerWidth <= 560
      || document.documentElement.clientWidth <= 560
      || window.screen.width <= 560;
  }

  function collapseRailForNarrowViewport() {
    const rail = byId("page-rail");
    if (rail && isNarrowViewport()) {
      rail.classList.add("is-collapsed");
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.left = "-1000px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("Copy command was rejected by the browser.");
    }
  }

  function setCopyState(button, copied) {
    button.classList.toggle("is-copied", copied);
    button.setAttribute("aria-label", copied ? "Merged agent prompt copied" : "Copy merged agent prompt");
    button.title = copied ? "Copied" : "Copy merged agent prompt";
  }

  function mergedPromptForNode(promptNode) {
    const fixedPrompt = String(promptNode?.querySelector("[data-prompt-fixed]")?.textContent || "").trim();
    const addon = String(promptNode?.querySelector("[data-prompt-addon]")?.value || "").trim();
    if (!fixedPrompt) return addon;
    if (!addon) return fixedPrompt;
    return `${fixedPrompt}\n\nAdditional user request:\n${addon}`;
  }

  function setupPromptCopy() {
    document.addEventListener("click", async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-copy-prompt]");
      if (!button) return;
      const prompt = button.closest(".skill-prompt");
      const text = mergedPromptForNode(prompt);
      if (!text.trim()) return;

      try {
        await copyText(text);
        setCopyState(button, true);
        window.setTimeout(() => setCopyState(button, false), 1400);
      } catch (error) {
        console.error("Could not copy Flashtotype prompt", error);
        button.title = "Copy failed";
      }
    });
  }

  function bridgeUrl(path) {
    const base = `${codexBridge.config.url}/`;
    return new URL(path.replace(/^\/+/, ""), base).toString();
  }

  function createBridgeToken() {
    const bytes = new Uint8Array(24);
    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256);
      }
    }
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  }

  function storageKey() {
    const project = window.FLASHTOTYPE_DATA?.projectName || "project";
    return `flashtotype:${project}:codex-bridge-token`;
  }

  function getBridgeToken() {
    if (codexBridge.token) return codexBridge.token;
    try {
      const stored = window.sessionStorage?.getItem(storageKey());
      if (stored) {
        codexBridge.token = stored;
        return stored;
      }
    } catch {}
    codexBridge.token = createBridgeToken();
    try {
      window.sessionStorage?.setItem(storageKey(), codexBridge.token);
    } catch {}
    return codexBridge.token;
  }

  function quotePowerShell(value) {
    return `'${String(value || "").replaceAll("'", "''")}'`;
  }

  function quoteShell(value) {
    return `'${String(value || "").replaceAll("'", "'\\''")}'`;
  }

  function outputDirectoryPath() {
    if (window.location.protocol !== "file:") return "";
    let pathname = decodeURIComponent(window.location.pathname || "");
    if (/^\/[a-z]:\//i.test(pathname)) pathname = pathname.slice(1);
    const isWindowsPath = /^[a-z]:\//i.test(pathname);
    const separator = isWindowsPath ? "\\" : "/";
    const normalized = isWindowsPath ? pathname.replaceAll("/", "\\") : pathname;
    const index = normalized.lastIndexOf(separator);
    return index >= 0 ? normalized.slice(0, index) : "";
  }

  function bridgeStartCommand() {
    const token = getBridgeToken();
    const outputDir = outputDirectoryPath();
    if (outputDir && /^[a-z]:\\/i.test(outputDir)) {
      const scriptPath = `${outputDir}\\start-flashtotype-bridge.ps1`;
      return `powershell -NoProfile -ExecutionPolicy Bypass -File ${quotePowerShell(scriptPath)} -Token ${quotePowerShell(token)}`;
    }
    if (outputDir) {
      return `cd ${quoteShell(outputDir)} && node ./flashtotype-codex-bridge.mjs --token ${quoteShell(token)}`;
    }
    return `node ./flashtotype-codex-bridge.mjs --token ${quoteShell(token)}`;
  }

  async function bridgeFetch(path, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), options.timeout || CODEX_BRIDGE_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(bridgeUrl(path), {
        cache: "no-store",
        ...options,
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Bridge request failed with ${response.status}.`);
      }
      return payload;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function bridgeHeaders(token) {
    return {
      "Content-Type": "application/json",
      "X-Flashtotype-Token": token
    };
  }

  function panelDefaults() {
    const health = codexBridge.health || {};
    return {
      provider: normalizeBridgeProvider(health.defaultProvider || codexBridge.config.defaultProvider),
      sandbox: normalizeBridgeSandbox(health.defaultSandbox || codexBridge.config.defaultSandbox)
    };
  }

  function refreshCodexBridgePanels() {
    if (!codexBridge.config) return;
    const panels = document.querySelectorAll("[data-codex-bridge-panel]");
    panels.forEach((panel) => {
      panel.hidden = !codexBridge.config.enabled;
      const defaults = panelDefaults();
      const status = panel.querySelector("[data-codex-status]");
      const provider = panel.querySelector("[data-codex-provider]");
      const sandbox = panel.querySelector("[data-codex-sandbox]");
      if (!panel.dataset.codexDefaultsReady) {
        if (provider) provider.value = defaults.provider;
        if (sandbox) sandbox.value = defaults.sandbox;
        panel.dataset.codexDefaultsReady = "true";
      }
      if (status) {
        status.textContent = codexBridge.online
          ? `Local Codex bridge online: ${defaults.provider}, ${defaults.sandbox}`
          : "Local Codex bridge offline. Run prompt will show the start command.";
      }
    });
  }

  async function checkBridgeHealth() {
    if (!codexBridge.config?.enabled) return;
    try {
      const health = await bridgeFetch("/health", { method: "GET" });
      codexBridge.online = Boolean(health.ok);
      codexBridge.health = health;
    } catch {
      codexBridge.online = false;
      codexBridge.health = null;
    }
    refreshCodexBridgePanels();
  }

  function openBridgeSetupModal(promptNode) {
    codexBridge.pendingPromptNode = promptNode || null;
    const modal = byId("codex-bridge-modal");
    const command = byId("codex-bridge-command");
    if (!modal || !command) return;
    command.textContent = bridgeStartCommand();
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    const copyButton = modal.querySelector("[data-copy-bridge-command]");
    if (copyButton) copyButton.focus({ preventScroll: true });
  }

  function closeBridgeSetupModal() {
    const modal = byId("codex-bridge-modal");
    if (!modal) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
  }

  async function copyBridgeCommand(button) {
    const command = byId("codex-bridge-command")?.textContent || "";
    if (!command.trim()) return;
    try {
      await copyText(command);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy command";
      }, 1400);
    } catch {
      button.textContent = "Copy failed";
    }
  }

  async function checkBridgeFromModal() {
    await checkBridgeHealth();
    if (!codexBridge.online) return;
    closeBridgeSetupModal();
    const pending = codexBridge.pendingPromptNode;
    codexBridge.pendingPromptNode = null;
    if (pending) {
      const button = pending.querySelector("[data-send-codex]");
      if (button) sendPromptToCodex(button);
    }
  }

  function setCodexOutput(promptNode, text, hidden = false) {
    const output = promptNode.querySelector("[data-codex-output]");
    if (!output) return;
    output.hidden = hidden || !text;
    output.textContent = text || "";
  }

  function setCodexStatus(promptNode, text) {
    const status = promptNode.querySelector("[data-codex-status]");
    if (status) status.textContent = text;
  }

  function setCodexRunning(promptNode, running, runId = "") {
    promptNode.dataset.codexRunId = runId;
    promptNode.querySelectorAll("[data-send-codex]").forEach((button) => {
      button.disabled = running;
    });
    promptNode.querySelectorAll("[data-cancel-codex]").forEach((button) => {
      button.hidden = !running;
    });
  }

  function summarizeRun(run) {
    if (run.finalMessage) return run.finalMessage;
    if (run.error) return run.error;
    const latest = Array.isArray(run.events) ? run.events.slice(-4) : [];
    return latest.map((event) => {
      if (event.text) return event.text;
      if (event.event?.type) return event.event.type;
      if (event.event?.method) return event.event.method;
      return "";
    }).filter(Boolean).join("\n");
  }

  async function pollCodexRun(promptNode, runId, token) {
    try {
      const run = await bridgeFetch(`/runs/${encodeURIComponent(runId)}`, {
        method: "GET",
        headers: bridgeHeaders(token),
        timeout: 5000
      });
      setCodexStatus(promptNode, `Codex run ${run.status}: ${run.provider}, ${run.sandbox}`);
      setCodexOutput(promptNode, summarizeRun(run));
      if (run.status === "queued" || run.status === "running") {
        window.setTimeout(() => pollCodexRun(promptNode, runId, token), CODEX_RUN_POLL_INTERVAL_MS);
      } else {
        setCodexRunning(promptNode, false);
      }
    } catch (error) {
      setCodexStatus(promptNode, "Codex run status unavailable");
      setCodexOutput(promptNode, error.message || "Could not read Codex run status.");
      setCodexRunning(promptNode, false);
    }
  }

  async function sendPromptToCodex(button) {
    const promptNode = button.closest("[data-codex-prompt]");
    if (!promptNode) return;
    const providerInput = promptNode.querySelector("[data-codex-provider]");
    const sandboxInput = promptNode.querySelector("[data-codex-sandbox]");
    const promptText = mergedPromptForNode(promptNode);
    const token = getBridgeToken();
    if (!promptText) {
      setCodexStatus(promptNode, "Prompt is empty");
      return;
    }
    if (!codexBridge.online) {
      setCodexStatus(promptNode, "Local Codex bridge offline");
      openBridgeSetupModal(promptNode);
      return;
    }

    setCodexRunning(promptNode, true);
    setCodexOutput(promptNode, "");
    setCodexStatus(promptNode, "Sending prompt to Codex");

    try {
      const run = await bridgeFetch("/runs", {
        method: "POST",
        headers: bridgeHeaders(token),
        body: JSON.stringify({
          prompt: promptText,
          provider: normalizeBridgeProvider(providerInput?.value),
          sandbox: normalizeBridgeSandbox(sandboxInput?.value)
        }),
        timeout: 5000
      });
      setCodexStatus(promptNode, `Codex run ${run.status}: ${run.provider}, ${run.sandbox}`);
      setCodexRunning(promptNode, true, run.id);
      pollCodexRun(promptNode, run.id, token);
    } catch (error) {
      setCodexStatus(promptNode, "Codex run failed to start");
      setCodexOutput(promptNode, error.message || "Could not start Codex run.");
      setCodexRunning(promptNode, false);
    }
  }

  async function cancelCodexRun(button) {
    const promptNode = button.closest("[data-codex-prompt]");
    const runId = promptNode?.dataset.codexRunId;
    const token = getBridgeToken();
    if (!promptNode || !runId || !token) return;
    try {
      const run = await bridgeFetch(`/runs/${encodeURIComponent(runId)}/cancel`, {
        method: "POST",
        headers: bridgeHeaders(token),
        body: "{}",
        timeout: 5000
      });
      setCodexStatus(promptNode, `Codex run ${run.status}`);
      setCodexOutput(promptNode, summarizeRun(run));
    } catch (error) {
      setCodexStatus(promptNode, "Cancel failed");
      setCodexOutput(promptNode, error.message || "Could not cancel Codex run.");
    } finally {
      setCodexRunning(promptNode, false);
    }
  }

  function setupCodexBridge() {
    if (!codexBridge.config?.enabled) return;
    getBridgeToken();
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const sendButton = event.target.closest("[data-send-codex]");
      if (sendButton) {
        sendPromptToCodex(sendButton);
        return;
      }
      const cancelButton = event.target.closest("[data-cancel-codex]");
      if (cancelButton) {
        cancelCodexRun(cancelButton);
        return;
      }
      const copyBridgeButton = event.target.closest("[data-copy-bridge-command]");
      if (copyBridgeButton) {
        copyBridgeCommand(copyBridgeButton);
        return;
      }
      if (event.target.closest("[data-check-bridge]")) {
        checkBridgeFromModal();
        return;
      }
      if (event.target.closest("[data-close-bridge-modal]")) {
        closeBridgeSetupModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const modal = byId("codex-bridge-modal");
      if (modal?.classList.contains("is-active")) closeBridgeSetupModal();
    });
    checkBridgeHealth();
    codexBridge.timer = window.setInterval(checkBridgeHealth, CODEX_BRIDGE_HEALTH_INTERVAL_MS);
  }

  function activePage() {
    return window.FLASHTOTYPE_DATA?.pages?.find((item) => item.id === state.activePageId);
  }

  function openContentModal(blockIndex) {
    const page = activePage();
    const block = page?.type === "home" && Array.isArray(page.blocks) ? page.blocks[blockIndex] : null;
    if (!block) return;
    const modal = byId("content-modal");
    const title = byId("content-modal-title");
    const source = byId("content-modal-source");
    const body = byId("content-modal-body");
    if (!modal || !title || !source || !body) return;
    title.textContent = block.title || "Overview section";
    const sourceLabel = blockSourceLabel(block);
    source.textContent = sourceLabel || "Embedded board content";
    source.hidden = !sourceLabel;
    body.innerHTML = renderMarkdown(blockMarkdown(block));
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    const closeButton = modal.querySelector("[data-close-content-modal]");
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeContentModal() {
    const modal = byId("content-modal");
    if (!modal) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
  }

  function setupContentModal() {
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const readButton = event.target.closest("[data-read-full]");
      if (readButton) {
        openContentModal(Number(readButton.getAttribute("data-read-full")));
        return;
      }
      if (event.target.closest("[data-close-content-modal]")) {
        closeContentModal();
        return;
      }
      const modal = byId("content-modal");
      if (modal?.classList.contains("is-active") && event.target === modal) {
        closeContentModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const modal = byId("content-modal");
      if (modal?.classList.contains("is-active")) closeContentModal();
    });
  }

  function setupModeSwitching() {
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-page-target]");
      if (!button) return;
      const pageId = button.getAttribute("data-page-target");
      if (!pageId) return;
      setPage(pageId);
      collapseRailForNarrowViewport();
    });
  }

  function activePresentationSlides() {
    const page = window.FLASHTOTYPE_DATA.pages.find((item) => item.id === state.activePageId);
    if (!page || page.type !== "presentation") return [];
    return Array.isArray(page.slides) ? page.slides : [];
  }

  function renderPresenterSlide(slide) {
    const visual = normalizeVisual(slide.visual);
    return `
      <article class="presenter-frame ${visualClass(visual, "presenter")}">
        ${visual.layout === "full-bleed" ? renderSlideVisual(visual, "presenter") : ""}
        ${visual.layout === "split-left" ? renderSlideVisual(visual, "presenter") : ""}
        <div class="presenter-content">
          <span>${escapeHtml(slide.eyebrow || "")}</span>
          <h1>${escapeHtml(slide.title || "Untitled slide")}</h1>
          <p>${escapeHtml(slide.body || "")}</p>
          ${plainList(slide.bullets)}
        </div>
        ${visual.layout === "split-right" ? renderSlideVisual(visual, "presenter") : ""}
      </article>
    `;
  }

  function setPresenterSlide(index) {
    if (!presenter.active || presenter.slides.length === 0) return;
    presenter.index = Math.min(Math.max(index, 0), presenter.slides.length - 1);
    const slide = presenter.slides[presenter.index];
    const slideNode = byId("presenter-slide");
    const counterNode = byId("presenter-counter");
    if (slideNode) slideNode.innerHTML = renderPresenterSlide(slide);
    if (counterNode) counterNode.textContent = `${presenter.index + 1} / ${presenter.slides.length}`;
    document.querySelectorAll("[data-present-prev]").forEach((button) => {
      button.disabled = presenter.index === 0;
    });
    document.querySelectorAll("[data-present-next]").forEach((button) => {
      button.disabled = presenter.index === presenter.slides.length - 1;
    });
  }

  async function openPresenter(slides, startIndex) {
    const overlay = byId("presenter-overlay");
    if (!overlay || !Array.isArray(slides) || slides.length === 0) return;
    presenter.active = true;
    presenter.slides = slides;
    presenter.index = 0;
    presenter.ownsFullscreen = false;
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    setPresenterSlide(startIndex || 0);

    const closeButton = overlay.querySelector("[data-present-close]");
    if (closeButton) closeButton.focus({ preventScroll: true });

    try {
      if (overlay.requestFullscreen && !document.fullscreenElement) {
        await overlay.requestFullscreen();
        presenter.ownsFullscreen = document.fullscreenElement === overlay;
      }
    } catch (error) {
      presenter.ownsFullscreen = false;
    }
  }

  function closePresenter(options = {}) {
    const overlay = byId("presenter-overlay");
    if (!overlay) return;
    overlay.classList.remove("is-active");
    overlay.setAttribute("aria-hidden", "true");
    presenter.active = false;
    presenter.slides = [];
    presenter.index = 0;
    if (!options.fromFullscreenChange && presenter.ownsFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    presenter.ownsFullscreen = false;
  }

  function movePresenter(delta) {
    setPresenterSlide(presenter.index + delta);
  }

  function setupPresenter() {
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-present-deck]")) {
        openPresenter(activePresentationSlides(), 0);
        return;
      }
      if (event.target.closest("[data-present-close]")) {
        closePresenter();
        return;
      }
      if (event.target.closest("[data-present-prev]")) {
        movePresenter(-1);
        return;
      }
      if (event.target.closest("[data-present-next]")) {
        movePresenter(1);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!presenter.active) return;
      const key = event.key;
      if (key === "ArrowRight" || key === " " || key === "PageDown") {
        event.preventDefault();
        movePresenter(1);
      } else if (key === "ArrowLeft" || key === "PageUp") {
        event.preventDefault();
        movePresenter(-1);
      } else if (key === "Home") {
        event.preventDefault();
        setPresenterSlide(0);
      } else if (key === "End") {
        event.preventDefault();
        setPresenterSlide(presenter.slides.length - 1);
      } else if (key === "Escape") {
        event.preventDefault();
        closePresenter();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      const overlay = byId("presenter-overlay");
      if (presenter.active && presenter.ownsFullscreen && document.fullscreenElement !== overlay) {
        closePresenter({ fromFullscreenChange: true });
      }
    });
  }

  function isPanSurface(event) {
    if (!(event.target instanceof Element)) return false;
    return !event.target.closest(PAN_EXCLUDED_SELECTOR);
  }

  function canStartPan(event) {
    if (event.pointerType !== "mouse") return false;
    if (event.button !== RIGHT_MOUSE_BUTTON) return false;
    return isPanSurface(event);
  }

  function stopPan(viewport, event) {
    if (!pan.active) return;
    if (event.pointerId !== undefined && event.pointerId !== pan.pointerId) return;
    if (typeof viewport.hasPointerCapture === "function" && viewport.hasPointerCapture(pan.pointerId)) {
      viewport.releasePointerCapture(pan.pointerId);
    }
    pan.active = false;
    pan.pointerId = null;
    viewport.classList.remove("is-panning");
  }

  function setupPan() {
    const viewport = byId("board-viewport");
    if (!viewport || viewport.dataset.panReady === "true") return;
    viewport.dataset.panReady = "true";

    viewport.addEventListener("pointerdown", (event) => {
      if (!canStartPan(event)) return;
      pan.active = true;
      pan.pointerId = event.pointerId;
      pan.startX = event.clientX;
      pan.startY = event.clientY;
      pan.scrollLeft = viewport.scrollLeft;
      pan.scrollTop = viewport.scrollTop;
      viewport.classList.add("is-panning");
      if (typeof viewport.setPointerCapture === "function") {
        viewport.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!pan.active || event.pointerId !== pan.pointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & RIGHT_MOUSE_BUTTON_MASK) !== RIGHT_MOUSE_BUTTON_MASK) {
        stopPan(viewport, event);
        return;
      }
      viewport.scrollLeft = pan.scrollLeft - (event.clientX - pan.startX);
      viewport.scrollTop = pan.scrollTop - (event.clientY - pan.startY);
      event.preventDefault();
    });

    viewport.addEventListener("pointerup", (event) => stopPan(viewport, event));
    viewport.addEventListener("pointercancel", (event) => stopPan(viewport, event));
    viewport.addEventListener("lostpointercapture", (event) => stopPan(viewport, event));
    viewport.addEventListener("contextmenu", (event) => {
      if (isPanSurface(event)) event.preventDefault();
    });
  }

  function setupWheelZoom() {
    const viewport = byId("board-viewport");
    if (!viewport || viewport.dataset.wheelZoomReady === "true") return;
    viewport.dataset.wheelZoomReady = "true";

    viewport.addEventListener("wheel", (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();

      const previousZoom = state.zoom;
      const direction = event.deltaY < 0 ? 1 : -1;
      const nextZoom = setZoom(previousZoom + (direction * WHEEL_ZOOM_STEP));
      if (nextZoom === previousZoom) return;

      const rect = viewport.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const zoomRatio = nextZoom / previousZoom;

      viewport.scrollLeft = ((viewport.scrollLeft + pointerX) * zoomRatio) - pointerX;
      viewport.scrollTop = ((viewport.scrollTop + pointerY) * zoomRatio) - pointerY;
    }, { passive: false });
  }

  function ensureRequiredPages(data) {
    const ids = new Set(data.pages.map((page) => page.id));
    return REQUIRED_PAGE_IDS.every((id) => ids.has(id));
  }

  function init() {
    const data = readData();
    window.FLASHTOTYPE_DATA = data;
    codexBridge.config = data.codexBridge || normalizeCodexBridgeConfig();
    renderHeader(data);
    collapseRailForNarrowViewport();
    window.addEventListener("resize", collapseRailForNarrowViewport);

    if (!ensureRequiredPages(data)) {
      console.warn("Flashtotype board is missing one or more recommended pages:", REQUIRED_PAGE_IDS);
    }

    const requestedId = window.location.hash.replace("#", "");
    state.activePageId = data.pages.some((page) => page.id === requestedId)
      ? requestedId
      : (data.pages[0]?.id || "");

    renderPageMenu(data);
    setZoom(1);
    setPage(state.activePageId);
    setupPan();
    setupWheelZoom();
    setupPromptCopy();
    setupCodexBridge();
    setupContentModal();
    setupModeSwitching();
    setupPresenter();

    byId("menu-toggle").addEventListener("click", () => {
      byId("page-rail").classList.toggle("is-collapsed");
    });
    byId("zoom-out").addEventListener("click", () => setZoom(state.zoom - 0.1));
    byId("zoom-in").addEventListener("click", () => setZoom(state.zoom + 0.1));
    byId("reset-view").addEventListener("click", () => setZoom(1));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

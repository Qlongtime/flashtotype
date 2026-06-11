(function () {
  const REQUIRED_PAGE_IDS = ["home", "journey", "prototype", "design", "library"];
  const RIGHT_MOUSE_BUTTON = 2;
  const RIGHT_MOUSE_BUTTON_MASK = 2;
  const PAN_EXCLUDED_SELECTOR = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "[role='button']",
    ".page-rail",
    ".topbar",
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
    library: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h10"/></svg>`
  };

  const DEFAULT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;

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

  function readData() {
    const node = document.getElementById("flashtotype-data");
    if (!node) return { pages: [] };
    try {
      const data = JSON.parse(node.textContent);
      data.pages = Array.isArray(data.pages) ? data.pages : [];
      return data;
    } catch (error) {
      console.error("Invalid Flashtotype JSON data", error);
      return {
        projectName: "Invalid board data",
        subtitle: "Fix the JSON inside the flashtotype-data script tag.",
        status: "Invalid",
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
    listNode.innerHTML = data.pages.map((page, index) => `
      <button class="page-button" type="button" data-page-id="${escapeHtml(page.id)}" aria-current="${page.id === state.activePageId ? "page" : "false"}">
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
          <h1 class="board-title">${escapeHtml(page.title || "Project Overview")}</h1>
          <p class="board-summary">${escapeHtml(page.summary || "")}</p>
          ${renderMetricRow(page.metrics)}
          <div class="board-grid">
            ${blocks.map((block) => `
              <article class="tile span-6">
                <h2>${escapeHtml(block.title)}</h2>
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

  function renderPrototype(page) {
    const screens = Array.isArray(page.screens) ? page.screens : [];
    const notes = Array.isArray(page.notes) ? page.notes : [];
    return `
      <div class="page-frame is-canvas">
        ${sourceStrip(page)}
        <h1 class="board-title">${escapeHtml(page.title || "Prototype Workspace")}</h1>
        <p class="board-summary">${escapeHtml(page.summary || "")}</p>
        <section class="prototype-canvas">
          ${screens.map((screen) => `
            <article class="screen-frame" style="left:${toNumber(screen.x, 0)}px;top:${toNumber(screen.y, 0)}px">
              <div class="screen-top">${escapeHtml(screen.state || "Draft")}</div>
              <div class="wire-block accent"></div>
              <div class="wire-block"></div>
              <div class="wire-block short"></div>
              <h3>${escapeHtml(screen.title)}</h3>
              <p>${escapeHtml(screen.body)}</p>
            </article>
          `).join("")}
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

  function renderSkillPrompt(skill) {
    if (!skill.prompt) return "";
    return `
      <div class="skill-prompt">
        <div class="prompt-toolbar">
          <span>Agent prompt</span>
          <button class="copy-prompt-button" type="button" data-copy-prompt aria-label="Copy agent prompt" title="Copy agent prompt"></button>
        </div>
        <details>
          <summary>Inspect prompt</summary>
          <div class="prompt-panel">
            <pre class="prompt-code"><code>${escapeHtml(skill.prompt)}</code></pre>
          </div>
        </details>
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
    else if (page.type === "library") stage.innerHTML = renderLibrary(page);
    else stage.innerHTML = renderFallback(page);
    renderPageMenu(window.FLASHTOTYPE_DATA);
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
    state.zoom = Math.min(1.25, Math.max(0.55, nextZoom));
    byId("board-stage").style.transform = `scale(${state.zoom})`;
    byId("zoom-label").textContent = `${Math.round(state.zoom * 100)}%`;
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
    button.setAttribute("aria-label", copied ? "Agent prompt copied" : "Copy agent prompt");
    button.title = copied ? "Copied" : "Copy agent prompt";
  }

  function setupPromptCopy() {
    document.addEventListener("click", async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-copy-prompt]");
      if (!button) return;
      const prompt = button.closest(".skill-prompt");
      const code = prompt?.querySelector(".prompt-code");
      const text = code?.textContent || "";
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

  function ensureRequiredPages(data) {
    const ids = new Set(data.pages.map((page) => page.id));
    return REQUIRED_PAGE_IDS.every((id) => ids.has(id));
  }

  function init() {
    const data = readData();
    window.FLASHTOTYPE_DATA = data;
    renderHeader(data);

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
    setupPromptCopy();

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

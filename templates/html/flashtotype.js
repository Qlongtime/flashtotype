(function () {
  const sectionOrder = [
    ["overview", "Overview"],
    ["product", "Product"],
    ["market", "Market"],
    ["persona", "Persona"],
    ["techRisk", "Tech/Risk"]
  ];

  const labelClass = {
    "Source-backed": "source-backed",
    "Assumption": "assumption",
    "Needs validation": "needs-validation"
  };

  function readData() {
    const node = document.getElementById("flashtotype-data");
    if (!node) return {};
    try {
      return JSON.parse(node.textContent);
    } catch (error) {
      console.error("Invalid Flashtotype JSON data", error);
      return {
        productName: "Invalid decision pack data",
        tagline: "Fix the JSON inside the flashtotype-data script tag.",
        sections: {},
        evidence: [],
        nextActions: []
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

  function badge(label) {
    const klass = labelClass[label] || "needs-validation";
    return `<span class="badge ${klass}">${escapeHtml(label || "Needs validation")}</span>`;
  }

  function renderMetrics(data) {
    const metrics = Array.isArray(data.metrics) ? data.metrics : [];
    const html = metrics.map((metric) => `
      <div class="metric">
        <dt>${escapeHtml(metric.label)}</dt>
        <dd>${escapeHtml(metric.value)}</dd>
      </div>
    `).join("");
    document.getElementById("metrics").innerHTML = html;
  }

  function renderTabs(activeKey) {
    const tabs = document.getElementById("tabs");
    tabs.innerHTML = sectionOrder.map(([key, label]) => `
      <button class="tab" type="button" data-section="${key}" aria-selected="${key === activeKey}">
        ${escapeHtml(label)}
      </button>
    `).join("");

    tabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => renderSection(button.dataset.section));
    });
  }

  function renderClaims(claims) {
    if (!Array.isArray(claims) || claims.length === 0) {
      return '<p class="empty">No claims added yet.</p>';
    }

    return `
      <ul class="claim-list">
        ${claims.map((claim) => `
          <li class="claim">
            ${badge(claim.label)}
            <p><strong>${escapeHtml(claim.text || claim.claim)}</strong></p>
            ${claim.note ? `<p>${escapeHtml(claim.note)}</p>` : ""}
          </li>
        `).join("")}
      </ul>
    `;
  }

  function renderNotes(notes) {
    if (!Array.isArray(notes) || notes.length === 0) return "";
    return `
      <div class="split">
        ${notes.map((note) => `<div class="note-box">${escapeHtml(note)}</div>`).join("")}
      </div>
    `;
  }

  function renderSection(key) {
    const data = window.FLASHTOTYPE_DATA;
    const section = data.sections?.[key] || {};
    renderTabs(key);

    document.getElementById("main-panel").innerHTML = `
      <h2>${escapeHtml(section.title || "Untitled section")}</h2>
      <p class="summary">${escapeHtml(section.summary || data.summary || "")}</p>
      ${renderClaims(section.claims)}
      ${renderNotes(section.notes)}
    `;
  }

  function renderActions(data) {
    const actions = Array.isArray(data.nextActions) ? data.nextActions : [];
    document.getElementById("next-actions").innerHTML = actions.length
      ? actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")
      : '<li class="empty">No next actions added yet.</li>';
  }

  function renderEvidence(data) {
    const evidence = Array.isArray(data.evidence) ? data.evidence : [];
    if (evidence.length === 0) {
      document.getElementById("evidence-snapshot").innerHTML = '<p class="empty">No evidence added yet.</p>';
      return;
    }

    document.getElementById("evidence-snapshot").innerHTML = evidence.map((item) => {
      const source = item.url
        ? `<a href="${escapeHtml(item.url)}">${escapeHtml(item.sourceTitle || item.url)}</a>`
        : escapeHtml(item.sourceTitle || "No source");
      return `
        <div class="evidence-row">
          <div>${badge(item.label)}</div>
          <div>
            <strong>${escapeHtml(item.claim)}</strong>
            <p class="summary">${source}</p>
            <p class="summary">Confidence: ${escapeHtml(item.confidence || "Not set")}${item.accessedAt ? ` | Accessed: ${escapeHtml(item.accessedAt)}` : ""}</p>
            ${item.note ? `<p class="summary">${escapeHtml(item.note)}</p>` : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  function init() {
    const data = readData();
    window.FLASHTOTYPE_DATA = data;

    document.getElementById("product-name").textContent = data.productName || "Product idea";
    document.getElementById("tagline").textContent = data.tagline || data.summary || "";
    document.getElementById("verdict").textContent = data.verdict || "Draft";
    document.getElementById("confidence").textContent = `Confidence: ${data.confidence || "Not set"}`;

    renderMetrics(data);
    renderActions(data);
    renderEvidence(data);
    renderSection("overview");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


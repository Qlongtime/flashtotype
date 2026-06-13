import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  ".gitignore",
  "README.md",
  "AGENTS.md",
  "DOCS_POLICY.md",
  "DEPLOY.md",
  "LICENSE",
  "docs/README.md",
  "docs/BOOTSTRAP.md",
  "docs/EVIDENCE_POLICY.md",
  "docs/OUTPUT_CONTRACT.md",
  "docs/PROJECT_STRUCTURE.md",
  "agent/skills/flash-onboard/SKILL.md",
  "agent/skills/flash-onboard/agents/openai.yaml",
  "agent/skills/flash-revise/SKILL.md",
  "agent/skills/flash-revise/agents/openai.yaml",
  "agent/skills/flash-present/SKILL.md",
  "agent/skills/flash-present/agents/openai.yaml",
  "agent/skills/flash-research/SKILL.md",
  "agent/skills/flash-research/agents/openai.yaml",
  "agent/skills/flash-review/SKILL.md",
  "agent/skills/flash-review/agents/openai.yaml",
  "agent/skills/flashtotype-product-sidekick/SKILL.md",
  "agent/skills/flashtotype-product-sidekick/agents/openai.yaml",
  "agent/skills/flashtotype-product-sidekick/references/safe-run-rules.md",
  "agent/skills/flashtotype-product-sidekick/references/interview-flow.md",
  "agent/skills/flashtotype-product-sidekick/references/evidence-rules.md",
  "agent/skills/flashtotype-product-sidekick/references/output-contract.md",
  "agent/skills/flashtotype-presentation-generator/SKILL.md",
  "agent/skills/flashtotype-presentation-generator/agents/openai.yaml",
  "agent/skills/flashtotype-presentation-generator/references/data-storytelling.md",
  "user-workspace-template/current/START-HERE.md",
  "user-workspace-template/current/user-editable/README.md",
  "user-workspace-template/current/user-editable/flashtotype-brief.md",
  "user-workspace-template/current/user-editable/decision-pack.md",
  "user-workspace-template/current/user-editable/evidence.json",
  "user-workspace-template/current/user-editable/user-journey.md",
  "user-workspace-template/current/user-editable/prototype.md",
  "user-workspace-template/current/user-editable/Design.md",
  "user-workspace-template/current/user-editable/presentation.md",
  "user-workspace-template/current/user-editable/flashtotype-library.md",
  "user-workspace-template/current/user-editable/references/README.md",
  "user-workspace-template/current/user-editable/data/README.md",
  "user-workspace-template/current/user-editable/assets/README.md",
  "user-workspace-template/current/output/README.md",
  "user-workspace-template/current/output/assets/README.md",
  "agent/board-template/index.html",
  "agent/board-template/markdown-it.min.js",
  "agent/board-template/markdown-it.LICENSE.txt",
  "agent/board-template/flashtotype.js",
  "agent/board-template/flashtotype-codex-bridge.mjs",
  "agent/board-template/start-flashtotype-bridge.ps1",
  "agent/board-template/start-flashtotype-bridge.cmd",
  "agent/board-template/logo.png"
];
const forbiddenRootPaths = [
  "skills",
  "templates"
];

const failures = [];
const allowedVisualLayouts = new Set(["split-right", "split-left", "full-bleed", "none"]);
const allowedPrototypeElementTypes = new Set(["text", "field", "list", "card", "notice", "actions", "progress"]);
const commandNames = ["flash-onboard", "flash-revise", "flash-present", "flash-research", "flash-review"];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function isLocalRelativePath(value) {
  if (typeof value !== "string") return false;
  const src = value.trim();
  if (!src) return true;
  if (/^(https?:)?\/\//i.test(src)) return false;
  if (/^(data|file|javascript):/i.test(src)) return false;
  if (/^[a-z]:[\\/]/i.test(src)) return false;
  if (src.startsWith("/") || src.startsWith("\\") || src.includes("..")) return false;
  return true;
}

function isLoopbackHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:"
      && ["127.0.0.1", "localhost", "::1", "[::1]"].includes(url.hostname);
  } catch {
    return false;
  }
}

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

for (const path of forbiddenRootPaths) {
  if (existsSync(join(root, path))) {
    failures.push(`Deprecated root path must not exist: ${path}`);
  }
}

if (failures.length === 0) {
  const skill = read("agent/skills/flashtotype-product-sidekick/SKILL.md");
  if (!skill.startsWith("---\n")) {
    failures.push("Skill must start with YAML frontmatter.");
  }
  if (!/\nname: flashtotype-product-sidekick\n/.test(skill)) {
    failures.push("Skill frontmatter must include the expected name.");
  }
  if (!/\ndescription: .+/.test(skill)) {
    failures.push("Skill frontmatter must include a description.");
  }
  if (!skill.includes("references/safe-run-rules.md")) {
    failures.push("Skill workflow must require references/safe-run-rules.md.");
  }
  const productOpenAi = read("agent/skills/flashtotype-product-sidekick/agents/openai.yaml");
  if (!productOpenAi.includes("interface:") || !productOpenAi.includes("$flashtotype-product-sidekick")) {
    failures.push("Product sidekick openai.yaml must use interface metadata and an explicit skill prompt.");
  }
  const interviewFlow = read("agent/skills/flashtotype-product-sidekick/references/interview-flow.md");
  for (const marker of ["Ask no more than four concise questions", "Do not dump the full interview checklist"]) {
    if (!interviewFlow.includes(marker)) {
      failures.push(`Interview flow must preserve progressive onboarding UX: ${marker}.`);
    }
  }

  for (const commandName of commandNames) {
    const commandSkill = read(`agent/skills/${commandName}/SKILL.md`);
    const commandOpenAi = read(`agent/skills/${commandName}/agents/openai.yaml`);
    if (!commandSkill.startsWith("---\n") || !commandSkill.includes(`\nname: ${commandName}\n`)) {
      failures.push(`${commandName} must have valid skill frontmatter and the expected name.`);
    }
    if (commandSkill.includes("[TODO:")) {
      failures.push(`${commandName} must not contain scaffold TODO content.`);
    }
    if (!commandOpenAi.includes(`$${commandName}`) || !commandOpenAi.includes("allow_implicit_invocation: true")) {
      failures.push(`${commandName} openai.yaml must provide discoverable command metadata.`);
    }
  }
  const commandContracts = {
    "flash-present": [
      ".flashtotype/skills/flashtotype-presentation-generator/SKILL.md",
      "follow it as the primary workflow"
    ],
    "flash-research": [
      "Update `evidence.json` first",
      "Do not force the research to support the current recommendation"
    ],
    "flash-review": [
      "Do not edit files by default",
      "Ready with caveats",
      "findings ordered by severity"
    ]
  };
  for (const [commandName, markers] of Object.entries(commandContracts)) {
    const commandSkill = read(`agent/skills/${commandName}/SKILL.md`);
    for (const marker of markers) {
      if (!commandSkill.includes(marker)) {
        failures.push(`${commandName} must preserve workflow contract: ${marker}.`);
      }
    }
  }

  const presentationSkill = read("agent/skills/flashtotype-presentation-generator/SKILL.md");
  if (!presentationSkill.startsWith("---\n")) {
    failures.push("Presentation skill must start with YAML frontmatter.");
  }
  if (!/\nname: flashtotype-presentation-generator\n/.test(presentationSkill)) {
    failures.push("Presentation skill frontmatter must include the expected name.");
  }
  if (!presentationSkill.includes("references/data-storytelling.md")) {
    failures.push("Presentation skill workflow must require references/data-storytelling.md.");
  }
  for (const marker of ["default 10-slide order", "Opening title, audience context", "Thank you, decision ask"]) {
    if (!presentationSkill.includes(marker)) {
      failures.push(`Presentation skill must preserve the default opening/closing slide spine marker: ${marker}.`);
    }
  }
  const presentationOpenAi = read("agent/skills/flashtotype-presentation-generator/agents/openai.yaml");
  if (!presentationOpenAi.includes("$flashtotype-presentation-generator")) {
    failures.push("Presentation skill openai.yaml must include a default prompt using $flashtotype-presentation-generator.");
  }

  let evidence;
  try {
    evidence = JSON.parse(read("user-workspace-template/current/user-editable/evidence.json"));
  } catch (error) {
    failures.push(`evidence.json must be valid JSON: ${error.message}`);
    evidence = { claim_labels: [] };
  }
  const labels = evidence.claim_labels || [];
  for (const label of ["Source-backed", "Assumption", "Needs validation"]) {
    if (!labels.includes(label)) {
      failures.push(`evidence.json is missing claim label: ${label}`);
    }
  }

  const html = read("agent/board-template/index.html");
  if (!html.includes('id="flashtotype-data"')) {
    failures.push("HTML template must include flashtotype-data JSON script tag.");
  }
  if (!html.includes('src="flashtotype.js"')) {
    failures.push("HTML template must load flashtotype.js.");
  }
  if (!html.includes('src="markdown-it.min.js"')) {
    failures.push("HTML template must load the bundled Markdown renderer.");
  }
  if (!html.includes('src="logo.png"')) {
    failures.push("HTML template must use the board logo asset.");
  }
  if (!html.includes('id="brand-home"')) {
    failures.push("HTML template must expose the logo as a Flashtotype intro button.");
  }
  if (!html.includes('id="presenter-overlay"')) {
    failures.push("HTML template must include the presenter overlay.");
  }
  const renderer = read("agent/board-template/flashtotype.js");
  const markdownIt = read("agent/board-template/markdown-it.min.js");
  const markdownItLicense = read("agent/board-template/markdown-it.LICENSE.txt");
  const bridge = read("agent/board-template/flashtotype-codex-bridge.mjs");
  const startScript = read("agent/board-template/start-flashtotype-bridge.ps1");
  if (!html.includes("data-present-deck") && !renderer.includes("data-present-deck")) {
    failures.push("HTML template or renderer must include a data-present-deck trigger.");
  }
  if (!renderer.includes("MENU_EXCLUDED_PAGE_IDS") || !renderer.includes('"presentation"')) {
    failures.push("flashtotype.js must hide the presentation mode page from the project page rail.");
  }
  for (const marker of ["defaultIntroPage", "renderIntro", "introStorageKey", "data-intro-continue", "brand-home", '"intro"']) {
    if (!renderer.includes(marker)) {
      failures.push(`flashtotype.js must include intro page marker: ${marker}.`);
    }
  }
  const renderIntroBody = renderer.slice(renderer.indexOf("function renderIntro"), renderer.indexOf("function renderHome"));
  const renderHomeBody = renderer.slice(renderer.indexOf("function renderHome"), renderer.indexOf("function nodeCenter"));
  if (!renderIntroBody.includes("home-landing") || !renderIntroBody.includes("github.com/Qlongtime/flashtotype")) {
    failures.push("Intro renderer must own the Antigravity landing content and GitHub repository link.");
  }
  if (renderHomeBody.includes("home-landing") || renderHomeBody.includes("mockup-browser") || renderHomeBody.includes("tutorial-section")) {
    failures.push("Home renderer must remain the focused board overview, not the Antigravity intro landing page.");
  }
  if (!renderer.includes('data-page-target="presentation"')) {
    failures.push("Homepage renderer must include a Presentation mode button.");
  }
  if (!renderer.includes('data-page-target="home"')) {
    failures.push("Presentation renderer must include an Overview mode return button.");
  }
  for (const marker of ["renderPresentation", "openPresenter", "setPresenterSlide", "closePresenter"]) {
    if (!renderer.includes(marker)) {
      failures.push(`flashtotype.js must include presenter/render marker: ${marker}.`);
    }
  }
  for (const marker of ["renderPrototypeElement", "prototype-element", "prototype-screen-body"]) {
    if (!renderer.includes(marker)) {
      failures.push(`flashtotype.js must include structured prototype marker: ${marker}.`);
    }
  }
  if (renderer.includes('<div class="wire-block')) {
    failures.push("flashtotype.js must not hard-code anonymous prototype wire blocks.");
  }
  for (const marker of ["checkBridgeHealth", "data-send-codex", "data-prompt-addon", "data-prompt-fixed", "codex-bridge-modal", "start-flashtotype-bridge.ps1", "workspace-write", "Run prompt", "Optional user request", "data-read-full", "renderMarkdown", "content-modal"]) {
    if (!renderer.includes(marker)) {
      failures.push(`flashtotype.js must include local Codex bridge marker: ${marker}.`);
    }
  }
  if (renderer.includes("danger-full-access")) {
    failures.push("flashtotype.js must not expose danger-full-access in the board UI.");
  }
  for (const marker of ["window.markdownit", "html: false", "renderFallbackMarkdown"]) {
    if (!renderer.includes(marker)) {
      failures.push(`flashtotype.js must include Markdown renderer marker: ${marker}.`);
    }
  }
  if (!markdownIt.includes("markdown-it 14.2.0") || !markdownIt.includes("@license MIT")) {
    failures.push("markdown-it.min.js must be the vendored MIT-licensed markdown-it browser build.");
  }
  if (!markdownItLicense.includes("Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin")) {
    failures.push("markdown-it.LICENSE.txt must include the upstream MIT license.");
  }
  for (const marker of ["LOOPBACK_HOST = \"127.0.0.1\"", "/health", "/runs", "X-Flashtotype-Token", "timingSafeEqual", "app-server", "approval_policy"]) {
    if (!bridge.includes(marker)) {
      failures.push(`flashtotype-codex-bridge.mjs must include bridge safety/API marker: ${marker}.`);
    }
  }
  if (bridge.includes("danger-full-access")) {
    failures.push("flashtotype-codex-bridge.mjs must not allow danger-full-access.");
  }
  for (const marker of ["Get-Command node", "Get-Command codex", "flashtotype-codex-bridge.mjs", "--token", "--codex-bin", "Resolve-DefaultCwd"]) {
    if (!startScript.includes(marker)) {
      failures.push(`start-flashtotype-bridge.ps1 must include onboarding bridge marker: ${marker}.`);
    }
  }
  if (!html.includes('id="codex-bridge-modal"') || !html.includes('id="codex-bridge-command"')) {
    failures.push("HTML template must include the local Codex connection modal.");
  }
  if (!html.includes('id="content-modal"') || !html.includes('id="content-modal-body"')) {
    failures.push("HTML template must include the read-full content modal.");
  }

  const jsonMatch = html.match(/<script type="application\/json" id="flashtotype-data">([\s\S]*?)<\/script>/);
  if (!jsonMatch) {
    failures.push("Could not find embedded Flashtotype JSON.");
  } else {
    try {
      const boardData = JSON.parse(jsonMatch[1]);
      const requiredPageIds = ["home", "journey", "prototype", "design", "presentation", "library"];
      const pageIds = new Set((boardData.pages || []).map((page) => page.id));
      for (const pageId of requiredPageIds) {
        if (!pageIds.has(pageId)) {
          failures.push(`Embedded board data is missing page id: ${pageId}`);
        }
      }
      const presentationPage = (boardData.pages || []).find((page) => page.id === "presentation");
      const prototypePage = (boardData.pages || []).find((page) => page.id === "prototype");
      if (!prototypePage || !Array.isArray(prototypePage.screens) || prototypePage.screens.length === 0) {
        failures.push("Prototype page must include a non-empty screens array.");
      } else {
        prototypePage.screens.forEach((screen, screenIndex) => {
          if (!Array.isArray(screen.elements) || screen.elements.length === 0) {
            failures.push(`Prototype screen ${screenIndex + 1} must include structured elements.`);
            return;
          }
          screen.elements.forEach((element, elementIndex) => {
            if (!element || typeof element !== "object" || !allowedPrototypeElementTypes.has(element.type)) {
              failures.push(`Prototype screen ${screenIndex + 1} element ${elementIndex + 1} has an unsupported type.`);
            }
          });
        });
      }
      if (!presentationPage) {
        failures.push("Embedded board data must include a presentation page.");
      } else {
        if (presentationPage.hiddenFromMenu !== true) {
          failures.push("Embedded presentation page must be hidden from the project page rail.");
        }
        if (!Array.isArray(presentationPage.slides) || presentationPage.slides.length === 0) {
          failures.push("Presentation page must include a non-empty slides array.");
        } else {
          if (presentationPage.slides.length < 10) {
            failures.push("Starter presentation page must include the default 10-slide flow.");
          }
          const firstSlide = presentationPage.slides[0] || {};
          const lastSlide = presentationPage.slides[presentationPage.slides.length - 1] || {};
          if (!/opening/i.test(String(firstSlide.title || ""))) {
            failures.push("Starter presentation first slide must be the opening page.");
          }
          if (!/thank/i.test(String(lastSlide.title || ""))) {
            failures.push("Starter presentation last slide must be the thank-you page.");
          }
          presentationPage.slides.forEach((slide, index) => {
            if (!slide.visual) return;
            if (typeof slide.visual !== "object" || Array.isArray(slide.visual)) {
              failures.push(`Presentation slide ${index + 1} visual must be an object when present.`);
              return;
            }
            if (slide.visual.layout && !allowedVisualLayouts.has(slide.visual.layout)) {
              failures.push(`Presentation slide ${index + 1} has unsupported visual.layout: ${slide.visual.layout}.`);
            }
            if (!isLocalRelativePath(slide.visual.src || "")) {
              failures.push(`Presentation slide ${index + 1} visual.src must be a local relative path.`);
            }
            if (slide.visual.status === "generated" && !String(slide.visual.src || "").trim()) {
              failures.push(`Presentation slide ${index + 1} has generated visual status without visual.src.`);
            }
          });
        }
        if (!presentationPage.prompt || typeof presentationPage.prompt !== "string") {
          failures.push("Presentation page must include a copyable prompt string.");
        } else if (!presentationPage.prompt.includes("$flash-present")) {
          failures.push("Presentation page prompt must use $flash-present.");
        }
      }
      const libraryPage = (boardData.pages || []).find((page) => page.id === "library");
      const homePage = (boardData.pages || []).find((page) => page.id === "home");
      if (!homePage || !Array.isArray(homePage.blocks) || homePage.blocks.length === 0) {
        failures.push("Home page must include summary blocks.");
      } else {
        homePage.blocks.forEach((block, index) => {
          if (!String(block.body || "").trim()) {
            failures.push(`Home block ${index + 1} must include a short body summary.`);
          }
          if (!String(block.sourceFile || "").trim()) {
            failures.push(`Home block ${index + 1} must include sourceFile for the read-full modal.`);
          }
          if (!String(block.fullMarkdown || block.markdown || "").trim()) {
            failures.push(`Home block ${index + 1} must include fullMarkdown for the read-full modal.`);
          }
        });
      }
      const librarySkills = libraryPage?.skills || [];
      if (!Array.isArray(librarySkills) || librarySkills.length === 0) {
        failures.push("Library page must include installed skills in a skills array.");
      }
      if (!librarySkills.some((skill) => skill.name === "flashtotype-product-sidekick")) {
        failures.push("Library page skills must include flashtotype-product-sidekick.");
      }
      if (!librarySkills.some((skill) => skill.name === "flashtotype-presentation-generator")) {
        failures.push("Library page skills must include flashtotype-presentation-generator.");
      }
      for (const commandName of commandNames) {
        if (!librarySkills.some((skill) => skill.name === commandName)) {
          failures.push(`Library page skills must include ${commandName}.`);
        }
      }
      const skillsWithoutPrompts = librarySkills.filter((skill) => !skill.prompt || typeof skill.prompt !== "string");
      if (skillsWithoutPrompts.length > 0) {
        failures.push("Every library page skill must include a copyable prompt string.");
      }
      if (!Array.isArray(boardData.sourceFiles) || boardData.sourceFiles.length === 0) {
        failures.push("Embedded board data must include sourceFiles.");
      }
      if (boardData.codexBridge) {
        if (!isLoopbackHttpUrl(boardData.codexBridge.url || "")) {
          failures.push("Embedded codexBridge.url must be an HTTP loopback URL.");
        }
        if (!["exec", "app-server"].includes(boardData.codexBridge.defaultProvider)) {
          failures.push("Embedded codexBridge.defaultProvider must be exec or app-server.");
        }
        if (!["read-only", "workspace-write"].includes(boardData.codexBridge.defaultSandbox)) {
          failures.push("Embedded codexBridge.defaultSandbox must be read-only or workspace-write.");
        }
      }
    } catch (error) {
      failures.push(`Embedded HTML data must be valid JSON: ${error.message}`);
    }
  }

  const ignore = read(".gitignore");
  if (!ignore.includes("flashtotype-workspace/")) {
    failures.push(".gitignore must ignore flashtotype-workspace/.");
  }

  const bootstrapDocs = [
    read("AGENTS.md"),
    read("README.md"),
    read("docs/BOOTSTRAP.md"),
    read("docs/PROJECT_STRUCTURE.md"),
    read("docs/USER_JOURNEY.md")
  ].join("\n");
  for (const marker of [".agents/skills/", ...commandNames.map((name) => `$${name}`)]) {
    if (!bootstrapDocs.includes(marker)) {
      failures.push(`Bootstrap documentation must include ${marker}.`);
    }
  }

  for (const marker of [
    "Do not stop after installation",
    "do not ask me to restart Codex before onboarding",
    ".flashtotype/skills/flash-onboard/SKILL.md"
  ]) {
    if (!bootstrapDocs.includes(marker)) {
      failures.push(`Bootstrap documentation must preserve the same-thread onboarding contract: ${marker}.`);
    }
  }
  if (read("README.md").includes("After installation, start a new Codex thread")) {
    failures.push("README must not make a new Codex thread the next onboarding step.");
  }

  const startHere = read("user-workspace-template/current/START-HERE.md");
  for (const marker of [...commandNames.map((name) => `$${name}`), ".flashtotype/skills/flash-onboard/SKILL.md", "Restarting Codex is not required"]) {
    if (!startHere.includes(marker)) {
      failures.push(`START-HERE.md is missing recovery marker: ${marker}.`);
    }
  }

  const librarySource = read("user-workspace-template/current/user-editable/flashtotype-library.md");
  for (const commandName of commandNames) {
    if (!librarySource.includes(`| ${commandName} |`) || !librarySource.includes(`$${commandName}`)) {
      failures.push(`Starter Flashtotype library must include ${commandName} and its copyable prompt.`);
    }
  }

  const starterPresentation = read("user-workspace-template/current/user-editable/presentation.md");
  if (/test edit/i.test(starterPresentation)) {
    failures.push("Starter presentation must not contain temporary test-edit copy.");
  }
}

if (failures.length > 0) {
  console.error("Flashtotype validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Flashtotype validation passed.");

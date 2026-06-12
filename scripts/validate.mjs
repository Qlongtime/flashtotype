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
  "agent/skills/flashtotype-product-sidekick/SKILL.md",
  "agent/skills/flashtotype-product-sidekick/agents/openai.yaml",
  "agent/skills/flashtotype-product-sidekick/references/safe-run-rules.md",
  "agent/skills/flashtotype-product-sidekick/references/interview-flow.md",
  "agent/skills/flashtotype-product-sidekick/references/evidence-rules.md",
  "agent/skills/flashtotype-product-sidekick/references/output-contract.md",
  "agent/skills/flashtotype-presentation-generator/SKILL.md",
  "agent/skills/flashtotype-presentation-generator/agents/openai.yaml",
  "agent/skills/flashtotype-presentation-generator/references/data-storytelling.md",
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
  "agent/board-template/flashtotype.js",
  "agent/board-template/logo.png"
];
const forbiddenRootPaths = [
  "skills",
  "templates"
];

const failures = [];
const allowedVisualLayouts = new Set(["split-right", "split-left", "full-bleed", "none"]);

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
  if (!html.includes('src="logo.png"')) {
    failures.push("HTML template must use the board logo asset.");
  }
  if (!html.includes('id="presenter-overlay"')) {
    failures.push("HTML template must include the presenter overlay.");
  }
  const renderer = read("agent/board-template/flashtotype.js");
  if (!html.includes("data-present-deck") && !renderer.includes("data-present-deck")) {
    failures.push("HTML template or renderer must include a data-present-deck trigger.");
  }
  if (!renderer.includes("MENU_EXCLUDED_PAGE_IDS") || !renderer.includes('"presentation"')) {
    failures.push("flashtotype.js must hide the presentation mode page from the project page rail.");
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
      if (!presentationPage) {
        failures.push("Embedded board data must include a presentation page.");
      } else {
        if (presentationPage.hiddenFromMenu !== true) {
          failures.push("Embedded presentation page must be hidden from the project page rail.");
        }
        if (!Array.isArray(presentationPage.slides) || presentationPage.slides.length === 0) {
          failures.push("Presentation page must include a non-empty slides array.");
        } else {
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
        }
      }
      const libraryPage = (boardData.pages || []).find((page) => page.id === "library");
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
      const skillsWithoutPrompts = librarySkills.filter((skill) => !skill.prompt || typeof skill.prompt !== "string");
      if (skillsWithoutPrompts.length > 0) {
        failures.push("Every library page skill must include a copyable prompt string.");
      }
      if (!Array.isArray(boardData.sourceFiles) || boardData.sourceFiles.length === 0) {
        failures.push("Embedded board data must include sourceFiles.");
      }
    } catch (error) {
      failures.push(`Embedded HTML data must be valid JSON: ${error.message}`);
    }
  }

  const ignore = read(".gitignore");
  if (!ignore.includes("flashtotype-workspace/")) {
    failures.push(".gitignore must ignore flashtotype-workspace/.");
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

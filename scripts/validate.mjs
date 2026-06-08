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
  "skills/flashtotype-product-sidekick/SKILL.md",
  "skills/flashtotype-product-sidekick/agents/openai.yaml",
  "skills/flashtotype-product-sidekick/references/interview-flow.md",
  "skills/flashtotype-product-sidekick/references/evidence-rules.md",
  "skills/flashtotype-product-sidekick/references/output-contract.md",
  "templates/workspace/flashtotype-brief.md",
  "templates/workspace/decision-pack.md",
  "templates/workspace/evidence.json",
  "templates/html/index.html",
  "templates/html/flashtotype.js"
];

const failures = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

if (failures.length === 0) {
  const skill = read("skills/flashtotype-product-sidekick/SKILL.md");
  if (!skill.startsWith("---\n")) {
    failures.push("Skill must start with YAML frontmatter.");
  }
  if (!/\nname: flashtotype-product-sidekick\n/.test(skill)) {
    failures.push("Skill frontmatter must include the expected name.");
  }
  if (!/\ndescription: .+/.test(skill)) {
    failures.push("Skill frontmatter must include a description.");
  }

  let evidence;
  try {
    evidence = JSON.parse(read("templates/workspace/evidence.json"));
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

  const html = read("templates/html/index.html");
  if (!html.includes('id="flashtotype-data"')) {
    failures.push("HTML template must include flashtotype-data JSON script tag.");
  }
  if (!html.includes('src="flashtotype.js"')) {
    failures.push("HTML template must load flashtotype.js.");
  }

  const jsonMatch = html.match(/<script type="application\/json" id="flashtotype-data">([\s\S]*?)<\/script>/);
  if (!jsonMatch) {
    failures.push("Could not find embedded Flashtotype JSON.");
  } else {
    try {
      JSON.parse(jsonMatch[1]);
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

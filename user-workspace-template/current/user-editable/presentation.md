# Presentation

Use this file as the source for the `Presentation` board page.

## Presentation Metadata

- Audience:
- Decision needed:
- Recommended deck length: 8 slides
- Status: Draft
- Generated image folder: `../output/assets/`

## Story Spine

1. Title and decision needed.
2. User pain and current workaround.
3. Research backup and confidence.
4. Primary persona and moment of use.
5. Proposed workflow.
6. Prototype story.
7. Risks, assumptions, and validation gaps.
8. Recommended next validation plan.

## Copyable Agent Prompt

Agents should mirror this prompt into the `presentation.prompt` field on the board presentation page so users can copy it from the static HTML.

```text
Use $flashtotype-presentation-generator for this Flashtotype project.

Read `.flashtotype/skills/flashtotype-presentation-generator/SKILL.md` and follow it as the primary workflow. Create or update `flashtotype-workspace/current/user-editable/presentation.md` from the existing Flashtotype artifacts: `flashtotype-brief.md`, `decision-pack.md`, `evidence.json`, `user-journey.md`, `prototype.md`, `Design.md`, and `flashtotype-library.md`. Build a static 16:9 stakeholder slide story with evidence labels, source notes, speaker notes, generated image prompts, local visual asset references, top assumptions, validation gaps, and next actions. If image generation is available, save slide images under `flashtotype-workspace/current/output/assets/`; otherwise keep prompt-only visual placeholders. Regenerate the `presentation` page data inside `flashtotype-workspace/current/output/index.html` without adding a backend, build step, package manager, or network dependency.
```

When image generation is available, generate slide visuals from the same Flashtotype sources and save final images under `flashtotype-workspace/current/output/assets/`. If image generation fails or is unavailable, keep `Visual status: prompt-only` and render the prompt placeholder instead.

## Slides

### 01. Decision Snapshot

- Body: State the product idea, audience, decision needed, and recommendation.
- Bullets:
  - Product thesis
  - Recommendation
  - Confidence level
- Visual layout: split-right
- Visual prompt: Create a clean product decision dashboard illustration based only on the Flashtotype decision pack: a strategic workspace, evidence cards, and a clear proceed-pause-validate decision moment. No logos, no fake metrics, no readable UI text.
- Visual src:
- Visual alt: Conceptual decision dashboard with evidence cards.
- Visual status: prompt-only
- Evidence label: Needs validation
- Source note:
- Speaker notes: Open with the decision the team must make and what evidence is still weak.

### 02. User Pain

- Body: Explain the painful workflow, current workaround, and urgency signal.
- Bullets:
  - Primary persona
  - Current workaround
  - Why this matters now
- Visual layout: full-bleed
- Visual prompt: Create a realistic but anonymous scene of a product user struggling with fragmented notes, spreadsheets, and handoffs. Base the mood on the user pain in flashtotype-brief.md. No brands, no private data, no readable screen text.
- Visual src:
- Visual alt: Anonymous user dealing with a fragmented workflow.
- Visual status: prompt-only
- Evidence label: Needs validation
- Source note:
- Speaker notes: Anchor the story in the user's repeated moment of friction.

### 03. Research Backup

- Body: Summarize the strongest source-backed claims and the most important gaps.
- Bullets:
  - Cited sources
  - Confidence
  - Open gaps
- Visual layout: split-left
- Visual prompt: Create an evidence review board visual with source cards, confidence markers, and validation gaps inspired by evidence.json. Use abstract labels and shapes only; do not invent source names, numbers, charts, or readable citations.
- Visual src:
- Visual alt: Evidence board with source cards and validation gaps.
- Visual status: prompt-only
- Evidence label: Needs validation
- Source note:
- Speaker notes: Separate what is known from what still needs validation.

### 04. Primary Persona

- Body: Show who has the pain, their job to be done, adoption trigger, and objections.
- Bullets:
  - Role and context
  - Job to be done
  - Adoption trigger
- Visual layout: split-right
- Visual prompt: Create an anonymous primary persona scene that reflects the role, job-to-be-done, adoption trigger, and objections in flashtotype-brief.md. Keep it professional and specific to the workflow, without identifiable people, logos, or readable text.
- Visual src:
- Visual alt: Anonymous persona in their workflow context.
- Visual status: prompt-only
- Evidence label: Needs validation
- Source note:
- Speaker notes: Connect persona details to the buying or usage moment.

### 05. Proposed Workflow

- Body: Walk through the proposed user flow and system response.
- Bullets:
  - Entry point
  - Core action
  - Output
- Visual layout: split-left
- Visual prompt: Create a clean workflow illustration based on user-journey.md and prototype.md: entry point, core user action, system response, and output. Use simple diagrammatic forms without readable labels, invented screens, or unsupported claims.
- Visual src:
- Visual alt: Conceptual workflow from entry point to output.
- Visual status: prompt-only
- Evidence label: Assumption
- Source note:
- Speaker notes: Explain how the workflow changes the current workaround.

### 06. Prototype Story

- Body: Describe the smallest prototype scenario that can prove the painful moment.
- Bullets:
  - First scenario
  - What it proves
  - What it does not prove
- Visual layout: split-right
- Visual prompt: Create a prototype review scene based on prototype.md, showing a simple product flow being evaluated against one painful user moment. Avoid detailed fake UI text, brand marks, and unsupported feature detail.
- Visual src:
- Visual alt: Prototype review scene focused on a user pain moment.
- Visual status: prompt-only
- Evidence label: Assumption
- Source note:
- Speaker notes: Keep this focused on what the prototype must prove first.

### 07. Risks And Assumptions

- Body: List the top delivery, data, adoption, market, or compliance risks.
- Bullets:
  - Highest-risk assumption
  - Validation gap
  - Mitigation
- Visual layout: full-bleed
- Visual prompt: Create an abstract risk and assumption map inspired by decision-pack.md and evidence.json. Show uncertainty, dependencies, and mitigation paths visually without fake data, charts, or readable labels.
- Visual src:
- Visual alt: Abstract risk map with assumptions and mitigation paths.
- Visual status: prompt-only
- Evidence label: Needs validation
- Source note:
- Speaker notes: Make clear what would change the recommendation.

### 08. Validation Plan

- Body: List the next 3 to 5 validation actions and the success metric.
- Bullets:
  - User interview
  - Source-backed research
  - Prototype review
- Visual layout: split-right
- Visual prompt: Create a validation roadmap visual based on the next actions in decision-pack.md: interviews, research, prototype review, and a decision checkpoint. Use milestone shapes and neutral workspace imagery; no invented dates, metrics, or readable text.
- Visual src:
- Visual alt: Validation roadmap with research and prototype review milestones.
- Visual status: prompt-only
- Evidence label: Assumption
- Source note:
- Speaker notes: Close by asking for the next decision or research commitment.

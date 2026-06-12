# User Journey From Zero

This journey explains how a user can start with no project material and use Flashtotype to produce a research-backed product brief, prototype direction, and stakeholder presentation.

## Starting Point

The user only needs:

- A rough product idea, problem, or opportunity.
- A local project folder.
- Codex available to run the Flashtotype agent workflow.

They do not need existing research, code, designs, product docs, or a prototype.

## Step-By-Step Journey

1. Create or open a blank project folder.

   Example:

   ```text
   my-new-product-idea/
   ```

2. Ask Codex to install Flashtotype into that project.

   Recommended prompt:

   ```text
   Use the Flashtotype repository at https://github.com/Qlongtime/flashtotype.git to install the Flashtotype PM/PO sidekick into this project.

   First, access the repository at that URL (by cloning it to a temporary directory or fetching the files) and read its "AGENTS.md" file to learn how Flashtotype works. Follow the installation guidelines in "AGENTS.md" to set up the workspace folders, copy the agent skills and board templates, and update our target .gitignore. Keep all generated work private by default.

   Do not stop after installation and do not ask me to restart Codex before onboarding. In this same conversation, read `.flashtotype/skills/flash-onboard/SKILL.md` directly and begin the product interview.
   ```

3. Flashtotype creates the local workspace.

   Key folders:

   ```text
   .agents/skills/
   .flashtotype/
   flashtotype-workspace/current/START-HERE.md
   flashtotype-workspace/current/user-editable/
   flashtotype-workspace/current/output/
   ```

4. The installing agent starts the guided workflow immediately.

   The agent reads `.flashtotype/skills/flash-onboard/SKILL.md` directly and asks the first product questions in the installation conversation. The user should not need to restart or enter another command.

   If the user later reopens the project, invoke:

   ```text
   $flash-onboard
   ```

   The recovery prompt is also stored in `flashtotype-workspace/current/START-HERE.md`. If the skill is not visible in `/skills`, ask Codex to read `.flashtotype/skills/flash-onboard/SKILL.md` directly. Restarting is optional.

5. The agent interviews the user.

   The interview should cover:

   - Product idea and current thesis.
   - Target user and buyer, if different.
   - Pain, current workaround, and urgency.
   - Core workflow or moment of use.
   - Constraints such as time, team, budget, regulation, platform, and integrations.
   - Success metric and decision needed.
   - Known competitors, substitutes, or references.
   - Technical preferences or forbidden approaches.

6. Flashtotype creates the first working source files.

   These live in:

   ```text
   flashtotype-workspace/current/user-editable/
   ```

   Main files:

   ```text
   flashtotype-brief.md
   decision-pack.md
   evidence.json
   user-journey.md
   prototype.md
   Design.md
   presentation.md
   flashtotype-library.md
   ```

7. The agent performs the research pass.

   The agent investigates the market, competitors, substitutes, risks, user pain, and technical feasibility when browsing or source material is available.

   Every important claim is labeled as one of:

   ```text
   Source-backed
   Assumption
   Needs validation
   ```

   Source records and claim labels are stored in:

   ```text
   evidence.json
   ```

8. The agent creates the product strategy package.

   The package should include:

   - Product idea angle.
   - Market research angle.
   - User persona angle.
   - Tech stack and risk angle.
   - Recommendation.
   - Confidence level.
   - Top assumptions and validation gaps.
   - Next validation actions.

9. The agent creates the user journey.

   The user journey should show:

   - Where the pain appears.
   - What the user gives as input.
   - How the system responds.
   - What output or value the user receives.
   - What the team learns next.

10. The agent creates the prototype direction.

   The prototype source should define:

   - Entry point.
   - Main screen or workflow moment.
   - Core user action.
   - System response.
   - Output or decision result.
   - Edge cases and open questions.

11. The agent creates the design direction.

    The design source should define:

    - Product tone.
    - Visual priorities.
    - Colors and typography.
    - Core components.
    - Layout patterns.

12. The agent generates the static HTML board.

    Output path:

    ```text
    flashtotype-workspace/current/output/index.html
    ```

    The board includes:

    - Homepage product overview.
    - User journey flow.
    - Prototype workspace.
    - Design system.
    - Flashtotype library.
    - Presentation mode.

13. The user reviews the Homepage.

    Homepage overview cards show concise summaries by default. Each overview card includes a read-full control that opens embedded Markdown from the relevant source section.

14. The user opens Presentation mode.

    Presentation mode turns the decision pack into a stakeholder story:

    - Decision snapshot.
    - User pain.
    - Research backup.
    - Persona.
    - Workflow.
    - Prototype story.
    - Risks and assumptions.
    - Validation plan.

15. The user iterates with Codex.

    Choose the command by job:

    ```text
    Use $flash-revise to make the prototype focus on onboarding.
    Use $flash-research to add competitor evidence for the accounting software market.
    Use $flash-present to turn this into a CFO-facing presentation.
    Use $flash-review to check whether this decision pack is ready to share.
    ```

16. The agent updates source files and regenerates the board.

    The editable source files remain the source of truth. The output HTML is regenerated from them.

## Optional Local Codex Bridge

The static HTML works without a backend. If the optional local Codex bridge is running, the user can click `Run prompt` from the board to send the embedded agent prompt to local Codex.

If the bridge is offline, the board shows a copyable localhost command. This is optional and does not change the static HTML requirement.

## Final Outcome

Starting from zero, the user should end with:

- A structured product brief.
- A research-backed decision pack.
- A claim and source evidence ledger.
- A user journey.
- A prototype direction.
- A lightweight design system.
- A stakeholder presentation.
- A static local HTML board that can be reviewed with the team.

Flashtotype is not only a deck generator. It is a PM/PO workflow for turning a vague idea into a decision-ready product package.

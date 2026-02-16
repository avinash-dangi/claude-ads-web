# Development Workflow: The Agentic Flow

This guide outlines the "Best Way" to develop the `claude-ads-web` application by leveraging the `claude-ads-reference` repository as a knowledge base and specification source.

## Core Concept: Dual-Repo Architecture

We utilize two distinct repositories to separate **Logic/Knowledge** from **Implementation**:

1.  **`claude-ads-reference` (The Brain)**
    -   **Role**: Source of Truth, Knowledge Base, Specifications.
    -   **Contains**:
        -   **Skills**: Detailed instructions on *how* to audit specific platforms (e.g., `skills/ads-google`).
        -   **Agents**: Defines the persona and workflow for an auditor (e.g., `agents/audit-google.md`).
        -   **References**: Benchmarks, checklists, and scoring weights.
    -   **Usage**: We **READ** from this repo to understand *what* to build.

2.  **`claude-ads-web` (The Body)**
    -   **Role**: The User Interface, The Application, The Product.
    -   **Contains**: Next.js code, React components, Zustand stores, Tailwind styles.
    -   **Usage**: We **WRITE** to this repo to implement the features defined in the reference.

## The Agentic Workflow

When building a new feature or refining an existing one, follow this cycle:

### 1. Identify the Source of Truth
Before writing code, locate the corresponding skill or agent file in the reference repo.

| Web App Feature | Reference Source |
| :--- | :--- |
| Google Ads Audit | `agents/audit-google.md` & `skills/ads-google/SKILL.md` |
| Meta Ads Audit | `agents/audit-meta.md` & `skills/ads-meta/SKILL.md` |
| Scoring Logic | `ads/references/scoring-system.md` (implied path) |
| Strategy Planner | `skills/ads-plan/` |
| Budget Analysis | `skills/ads-budget/` |

### 2. Instruct the AI (Antigravity/Claude)
Tell the AI to read the reference file *first* to understand the logic.

**Prompt Template:**
> "I want to implement [Feature X] in the web app.
> First, please read using `view_file` the reference logic in `../claude-ads-reference/skills/[skill-name]/SKILL.md`.
> Understand the checks, weights, and benchmarks.
> Then, look at `src/components/[Component].tsx` in the web app and propose changes to match the reference logic."

### 3. Porting Logic to Code
The goal is to translate the *narrative* instructions of the Agent/Skill into *deterministic* Typescript code.

*   **Checks**: Convert Markdown checklists into Questionnaire Step objects.
*   **Weights**: Convert "Critical (5.0x)" text into `const SEVERITY_WEIGHTS` objects.
*   **Benchmarks**: Convert tables into `const BENCHMARKS` comparison logic.
*   **Findings**: Convert "If X, then Y" logic into `generateFindings()` functions.

### 4. Continuous Synchronization
As the `claude-ads-reference` repo is updated with new ad strategies or platform changes, the web app should be updated to reflect them.

**Workflow:**
1.  Check `claude-ads-reference` for updates (git pull).
2.  Compare the reference `SKILL.md` with the web app's `checklists/[platform].ts`.
3.  Update the web app to match the new best practices.

## Directory Mapping

| Reference Path (`../claude-ads-reference`) | Web App Path (`./claude-ads-web`) |
| :--- | :--- |
| `skills/ads-google/` | `app/(audit)/audit/google-ads/` |
| `skills/ads-meta/` | `app/(audit)/audit/meta-ads/` |
| `agents/` | `lib/scoring/` (Logic matches agent reasoning) |
| `skills/ads-plan/templates/` | `app/(plan)/plan/` |

## Best Practices
- **Do not guess**: Always verify the audit logic against the reference repo.
- **Maintain Terminology**: Use the same ID naming conventions (e.g., `G42`, `G-CT1`) in the code as in the reference docs to make cross-referencing easy.
- **Isolate Logic**: Keep scoring and validation logic in `lib/` (mirroring the "Brain") separate from UI components in `components/` (the "Body").

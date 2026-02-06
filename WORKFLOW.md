# Workflow

This document defines the team workflow for planning, building, testing, and deploying changes in this repository. It complements (does not replace) PLANS.md, which governs ExecPlans for agent-driven work.

## Sources of Truth

- Planning for larger changes: `PLANS.md` (ExecPlan rules and structure).
- Quality bar and release guidance: `docs/` (if present).

If a detail is missing here but exists elsewhere, add a short pointer here so the workflow stays discoverable.

## When to Use an ExecPlan

Use an ExecPlan when any of the following are true:

- The change is user-facing or changes behavior.
- The change touches multiple modules/services or requires schema changes.
- The work has unclear requirements, dependencies, or rollout risk.
- The work needs coordinated testing or deployment steps.

Small, contained fixes can proceed without an ExecPlan, but should still state scope and acceptance in the PR description.

## Planning and Definition of Done

For ExecPlan work, follow `PLANS.md` exactly. For smaller changes, define:

- Goal: what the user can do after the change.
- Acceptance: how to verify it (commands and expected outputs).
- Tests: the minimum set to run.

### Agent-Driven Quality Checklist

Before opening a PR, agents should:
- Attach an ExecPlan link for non-trivial changes.
- Run the minimum verification steps for the files or artifacts they touched.
- Provide a test plan and risk level in the PR template.
- List milestone commits in the PR when an ExecPlan is used.

## Branching and PRs

- Branch from `main`.
- Keep PRs focused and scoped.
- PR title format: `[repo-name] <Title>` (per repo instructions).

Branch naming: keep it semantic and concise (e.g., `fix-upload-timeout`, `feat-gap-summary`, `chore-build-warnings`).
Review policy: first pass is an agent review; use Playwright MCP for UI verification when relevant. After agent confirmation, human approval is required before merge.

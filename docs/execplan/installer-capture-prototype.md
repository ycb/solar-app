# Installer Capture Prototype Flow

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This repo includes `PLANS.md` at the repository root. This ExecPlan must be maintained in accordance with `PLANS.md`.

## Purpose / Big Picture

Installers need a mobile-first flow that guides them through inspection evidence capture without code knowledge. After this change, a user can open the prototype, step through a multi-screen capture flow, see clear progress and status, and understand whether each capture is pending, captured, accepted, or needs retry. The flow must support the revised array/racking scope and clearly indicate whether each capture expects a photo or a video.

## Progress

- [x] (2026-02-06 00:30Z) Finalize wireframe content updates to reflect new status model, media rules, and auto-check retry messaging.
- [x] (2026-02-06 01:20Z) Implement shared data model and UI modules for the capture flow in React.
- [x] (2026-02-06 01:20Z) Replace the component gallery with the actual 3-5 screen linear flow (Back/Next).
- [x] (2026-02-06 01:35Z) Validate the flow in the dev server and capture the current state in this plan.

## Surprises & Discoveries

- Observation: none yet.
  Evidence: n/a.

## Decision Log

- Decision: Use a Racking + Array step with three fully prototyped substeps (penetrations photos, edge alignment video, perimeter setback video), plus remaining photo-only steps.
  Rationale: This covers the core inspector questions while keeping the flow one task at a time.
  Date/Author: 2026-02-06 / Codex.

- Decision: Use per-item states Pending, Captured, Accepted, Retry and overall states Not started, In progress, Complete.
  Rationale: This matches the pre-inspection workflow and avoids a "needs review" state.
  Date/Author: 2026-02-06 / Codex.

- Decision: Accepted is only set by the automated check, and auto-check failures return a specific retry reason.
  Rationale: The prototype must simulate automated quality control and prompt actionable retries.
  Date/Author: 2026-02-06 / Codex.

## Outcomes & Retrospective

- Outcome: Implemented the linear flow UI with auto-check retry messaging and a complete prototype draft; dev server validation recorded.

## Context and Orientation

The prototype lives in a Vite + React + Tailwind front-end. The main entry is `src/App.tsx`, which renders the expanded flow prototype. Styles are in `src/index.css` and `tailwind.config.cjs`. The wireframe content is documented in `docs/WIREFRAMES.md`. Baseline requirements are in `docs/BASELINE.md` and `docs/PRODUCT_GOALS.md`. The specific permitted equipment list and project context are in `docs/PROJECT_DEFAULTS.md`, and the Project Details screen should surface the equipment list. The logo to use is `assets/logo.svg`. There is no backend.

The capture flow requires seven steps:
1) Racking + Array (substeps: roof penetrations photos, array edge alignment video, array perimeter setback video)
2) Inverter identity + clearance (Photo)
3) Battery location + clearance (Photo)
4) Disconnects (PV + ESS) (Photo)
5) Labels / placards (Photo)
6) Main service panel (Photo)
7) Conduit + wiring (Photo)

Per-item states are: Pending, Captured, Accepted, Retry. Overall states are: Not started, In progress, Complete.

## Plan of Work

First, update `docs/WIREFRAMES.md` to reflect the expanded flow and status model (Not started / In progress / Complete) and the media rules (video for array setbacks + edge alignment, photos for penetrations and other items). Make sure the screen descriptions use pass/fail language (Incomplete / Complete) rather than Draft/Ready. Ensure the Project Details screen includes the equipment list from `docs/PROJECT_DEFAULTS.md`. Add an auto-check error example that returns a specific issue and prompts a retry.

Next, replace the component gallery in `src/App.tsx` with the actual 3-5 screen flow. Keep the SolarAPP+ visual language but focus on one task at a time for the capture screen. Use a linear flow with Back/Next actions rather than a tabbed screen switcher.

Define a shared data model for capture items in `src/App.tsx` or a new file such as `src/data/captureItems.ts`. Each item should include id, title, prompt, captureType (Photo or Video), and status. Use this data to render the checklist, current task, and review grid.

Build the following screens:
- Projects List: Pending/Complete tabs, table of projects, Photos Needed row is actionable.
- Project Details: customer + system details and equipment list, Start/Continue Capture CTA.
- Capture Overview: accordion of steps with status, media type, and counts; opens first incomplete step.
- Step-level Overview: accordion of substeps with acceptance criteria; Start/Continue capture per substep.
- Capture Task Overview (Hub): instruction, thumbnail grid, count, Add capture CTA, Done disabled until minimum accepted.
- Camera (Minimal): shutter + cancel only.
- Inline Validation (Transient): checking state, accepted auto-return, retry feedback with retake/cancel.

Ensure the checklist shows required media type and counts, and the task hub shows captured thumbnails. Do not include non-image inputs. The Done action should remain disabled until the minimum required captures are Accepted by the auto-check.

Finally, update `docs/PRODUCT_GOALS.md` and `docs/BASELINE.md` if any media rules or status wording changed in the implementation.

## Concrete Steps

1) Update wireframe content.
   - Edit `docs/WIREFRAMES.md` to align with status and media rules.
   - Add the equipment list on the Project Details screen based on `docs/PROJECT_DEFAULTS.md`.
   - Add an auto-check error example with a specific retry reason.

2) Implement capture flow screens.
   - Edit `src/App.tsx` to replace the gallery with screen content.
   - Optionally create `src/components/` for reusable modules if it keeps the file readable.

3) Run the app.
   - From repo root:
     - `npm install`
     - `npm run dev`
   - Expect: Vite dev server starts and prints a localhost URL (usually http://localhost:5173).

## Validation and Acceptance

Start the dev server and verify:
- Projects list shows Pending/Complete tabs with one active Photos Needed row.
- Project details shows equipment list with two columns (count + type).
- Capture overview accordion opens to the first incomplete step.
- Step-level overview lists substeps and acceptance criteria.
- Capture task hub shows thumbnails, count, and Add/Done CTAs.
- Camera screen is minimal (shutter + cancel only).
- Validation shows checking state, then accepted (auto-return) or retry with specific feedback.
- Status labels read Not started, In progress, or Complete based on capture counts.
- Done is disabled until the minimum required captures are accepted.

## Idempotence and Recovery

These edits are front-end only and can be reapplied safely. If a screen looks wrong, revert only the relevant component in `src/App.tsx` and re-run the dev server.

## Artifacts and Notes

Capture a short note after validation:
  - "Dev server runs at http://localhost:5174 and screens switch correctly."

## Interfaces and Dependencies

Use existing dependencies in `package.json`: React, Vite, Tailwind. Do not add new libraries unless needed for layout. All state should be local to the prototype.

Change note: This ExecPlan was created to satisfy the requirement to use ExecPlans for complex, multi-screen changes.
Change note: Updated plan to reference `docs/PROJECT_DEFAULTS.md` and require an equipment list on the Project Details screen.
Change note: Updated plan to set main service panel to photo, require auto-check retry messaging, use a linear flow, and use `assets/logo.svg` in the header.
Change note: Marked wireframe updates as complete and added explicit auto-check acceptance decision in the Decision Log.
Change note: Implemented the linear flow screens in `src/App.tsx` and updated progress status.

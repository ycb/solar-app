# Installer Capture Prototype Flow

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This repo includes `PLANS.md` at the repository root. This ExecPlan must be maintained in accordance with `PLANS.md`.

## Purpose / Big Picture

Installers need a mobile-first flow that guides them through inspection evidence capture without code knowledge. After this change, a user can open the prototype, step through a 3-5 screen capture flow, see clear progress and pass/fail readiness, and understand whether each capture is pending, captured, accepted, or needs retry. The flow must support seven required capture groups and clearly indicate whether a capture expects a photo or a video.

## Progress

- [x] (2026-02-06 00:30Z) Finalize wireframe content updates to reflect new status model, media rules, and auto-check retry messaging.
- [x] (2026-02-06 01:20Z) Implement shared data model and UI modules for the capture flow in React.
- [x] (2026-02-06 01:20Z) Replace the component gallery with the actual 3-5 screen linear flow (Back/Next).
- [ ] Validate the flow in the dev server and capture the current state in this plan.

## Surprises & Discoveries

- Observation: none yet.
  Evidence: n/a.

## Decision Log

- Decision: Use seven required capture groups with one video item (array context + attachment) and photo for the rest, including main service panel.
  Rationale: Video is best when multiple angles are needed; photos are sufficient for single-view items.
  Date/Author: 2026-02-06 / Codex.

- Decision: Use per-item states Pending, Captured, Accepted, Retry and overall states Not started, In progress, Complete.
  Rationale: This matches the pre-inspection workflow and avoids a "needs review" state.
  Date/Author: 2026-02-06 / Codex.

- Decision: Accepted is only set by the automated check, and auto-check failures return a specific retry reason.
  Rationale: The prototype must simulate automated quality control and prompt actionable retries.
  Date/Author: 2026-02-06 / Codex.

## Outcomes & Retrospective

- Outcome: Implemented the linear flow UI and auto-check retry messaging; dev server validation pending.

## Context and Orientation

The prototype lives in a Vite + React + Tailwind front-end. The main entry is `src/App.tsx`, which renders the linear flow prototype. Styles are in `src/index.css` and `tailwind.config.cjs`. The wireframe content is documented in `docs/WIREFRAMES.md`. Baseline requirements are in `docs/BASELINE.md` and `docs/PRODUCT_GOALS.md`. The specific permitted equipment list and project context are in `docs/PROJECT_DEFAULTS.md`, and the Job Overview screen should surface a compact summary from that file. The logo to use is `assets/logo.svg`. There is no backend.

The capture flow requires seven groups:
1) Array context + attachment (Video)
2) Inverter identity + clearance (Photo)
3) Battery location + clearance (Photo)
4) Disconnects (PV + ESS) (Photo)
5) Fire access pathways (Photo)
6) Labels / placards (Photo)
7) Main service panel (Photo)

Per-item states are: Pending, Captured, Accepted, Retry. Overall states are: Not started, In progress, Complete.

## Plan of Work

First, update `docs/WIREFRAMES.md` to reflect the status model (Not started / In progress / Complete) and the media rules (video for array, photos elsewhere). Make sure the screen descriptions use pass/fail language (Incomplete / Complete) rather than Draft/Ready. Add an equipment summary section on the Job Overview screen that mirrors the permitted equipment list in `docs/PROJECT_DEFAULTS.md`. Add an auto-check error example that returns a specific issue and prompts a retry.

Next, replace the component gallery in `src/App.tsx` with the actual 3-5 screen flow. Keep the SolarAPP+ visual language but focus on one task at a time for the capture screen. Use a linear flow with Back/Next actions rather than a tabbed screen switcher.

Define a shared data model for capture items in `src/App.tsx` or a new file such as `src/data/captureItems.ts`. Each item should include id, title, prompt, captureType (Photo or Video), and status. Use this data to render the checklist, current task, and review grid.

Build the following screens:
- Job Overview: project summary, overall status (Not started / In progress / Complete), a compact permitted equipment summary from `docs/PROJECT_DEFAULTS.md`, the logo from `assets/logo.svg`, and a primary Start Capture action.
- Checklist + Progress: list all seven items with capture type pills and status chips.
- Current Task: one item at a time with guidance and a single capture CTA.
- Review + Readiness: media thumbnails, photo vs video indicators, per-item status, pass/fail readiness, and at least one auto-check error with a specific retry reason.
- Submit: completion summary and a submit action (mock).

Ensure thumbnails show a clear photo vs video indicator. Do not include non-image inputs. The readiness button should be disabled until all items are Accepted by the auto-check.

Finally, update `docs/PRODUCT_GOALS.md` and `docs/BASELINE.md` if any media rules or status wording changed in the implementation.

## Concrete Steps

1) Update wireframe content.
   - Edit `docs/WIREFRAMES.md` to align with status and media rules.
   - Add a permitted equipment summary section on the Job Overview screen based on `docs/PROJECT_DEFAULTS.md`.
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
- The prototype shows five screens in a linear flow (Back/Next).
- The checklist renders seven capture groups with correct media types.
- The current task screen focuses on one item at a time.
- The review screen shows pass/fail readiness, photo/video indicators, and a retry reason from an auto-check.
- Status chips display Pending, Captured, Accepted, Retry.
- Overall status reads Not started, In progress, or Complete based on item states.

## Idempotence and Recovery

These edits are front-end only and can be reapplied safely. If a screen looks wrong, revert only the relevant component in `src/App.tsx` and re-run the dev server.

## Artifacts and Notes

Capture a short note after validation:
  - "Dev server runs at http://localhost:5173 and screens switch correctly."

## Interfaces and Dependencies

Use existing dependencies in `package.json`: React, Vite, Tailwind. Do not add new libraries unless needed for layout. All state should be local to the prototype.

Change note: This ExecPlan was created to satisfy the requirement to use ExecPlans for complex, multi-screen changes.
Change note: Updated plan to reference `docs/PROJECT_DEFAULTS.md` and require an equipment summary on the Job Overview screen.
Change note: Updated plan to set main service panel to photo, require auto-check retry messaging, use a linear flow, and use `assets/logo.svg` in the Job Overview.
Change note: Marked wireframe updates as complete and added explicit auto-check acceptance decision in the Decision Log.
Change note: Implemented the linear flow screens in `src/App.tsx` and updated progress status.

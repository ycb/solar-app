# PRD - Solar Install Capture Prototype (v1)

## Summary

Build a mobile-first prototype that guides installers through a linear pre-inspection capture flow for residential solar + battery installs. The product enforces photo/video requirements, runs an automated quality check, and provides a simple inspection-readiness state before submission.

## Goals

- Capture the right evidence the first time to reduce inspector back-and-forth.
- Keep the installer focused on one task at a time with clear progress.
- Enforce capture type (photo vs video) and minimum quality via auto-check.

## Non-Goals

- No backend, authentication, or integrations.
- No jurisdiction-specific rules beyond the baseline capture groups.
- No non-image inputs (text entry, serial numbers, voice notes) in v1.

## Users

- Residential solar installers onsite, time-constrained, often solo or small crew.

## Assumptions

- Standalone prototype (not embedded in SolarAPP+).
- Two required videos (array setback for 3 ft clearance, and array edge alignment); all other items are photos.
- Acceptable imagery is well-lit, legible, and shows context plus detail.

## Evidence Required (v1)

The workflow must include the main service panel. The required capture steps are:

1. Racking + Array (substeps: roof penetrations photo series, array edge alignment video, array perimeter setback video)
2. Inverter identity + clearance (photo)
3. Battery location + clearance (photo)
4. PV + ESS disconnects (photo)
5. Labels / placards (photo)
6. Main service panel (photo)
7. Conduit + wiring (photo)

Rationale: these cover equipment identity, electrical connections, fire access, labeling, and workmanship verification.

## Workflow Rules

- Linear flow (no tabs).
- One task at a time in the capture step.
- Photo/video requirements are fixed per item.
- Auto-check runs after each capture and returns a specific issue if it fails.
- Accepted status is only set by the auto-check.

## States

Per item:
- Pending
- Captured (awaiting auto-check)
- Accepted
- Retry (auto-check failed with a reason)

Overall:
- Not started
- In progress
- Complete

## UX Requirements

- Clear photo vs video indicators on thumbnails and checklist items.
- Thumbnails support quick retake when in Retry.
- Overall progress visible throughout the flow.
- Completion state only (no numeric score), e.g., Not started / In progress / Complete.
- Complete is shown only when minimum required captures are Accepted.
- Project Details includes the equipment list (from `docs/PROJECT_DEFAULTS.md`).

## Screens (core)

- Projects List: Pending/Complete tabs, table of projects, only Photos Needed row is actionable.
- Project Details: customer + system details and equipment list, Start/Continue Capture CTA.
- Capture Overview: accordion of steps with status, media type, and counts; opens first incomplete step.
- Step-level Overview: accordion of substeps with acceptance criteria; Start/Continue capture per substep.
- Capture Task Overview (Hub): instruction, thumbnail grid, count, Add capture CTA, Done disabled until minimum accepted.
- Camera (Minimal): shutter + cancel only.
- Inline Validation (Transient): checking state, accepted auto-return, retry feedback with retake/cancel.

## Auto-check Scope

Auto-checks validate media quality and completeness, not compliance.

## Success Criteria (prototype)

- All required items can be completed in a single guided flow.
- Auto-check failure provides a clear retry reason.
- Installers understand what to capture without code language.

## Risks

- Over-scoping the checklist for a v1 prototype.
- Ambiguity in acceptable imagery without real-time feedback.

## Branding Notes

Visual style should feel consistent with SolarAPP+ (light, calm UI, blue panels, orange primary actions), adapted to a mobile-first experience.

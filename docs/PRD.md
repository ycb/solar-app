# PRD - Solar Install Capture Prototype (v1)

## Summary

Build a mobile-first prototype that guides installers through a linear pre-inspection capture flow for residential solar + battery installs. The product enforces photo/video requirements, runs an automated quality check, and provides a simple pass/fail readiness state before submission.

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
- Exactly one required video (array context + attachment); all other items are photos.
- Acceptable imagery is well-lit, legible, and shows context plus detail.

## Evidence Required (v1)

The workflow must include the main service panel. The required capture groups are:

1. Array context + attachment (video)
2. Inverter identity + clearance (photo)
3. Battery location + clearance (photo)
4. PV + ESS disconnects (photo)
5. Fire access pathways (photo)
6. Labels / placards (photo)
7. Main service panel (photo)

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
- Pass/fail readiness state only (no numeric score).
- Readiness passes only when all items are Accepted.
- Job Overview includes a compact permitted equipment summary (from `docs/PROJECT_DEFAULTS.md`).

## Screens (3-5 core)

- Job Overview: project context, permitted equipment summary, status, start capture.
- Capture Checklist: grouped tasks with progress and required media types.
- Capture Guidance: prompt + what-good-looks-like + capture action + auto-check result.
- Review & Readiness: thumbnails, retake prompts, pass/fail state.
- Submit: confirmation and mock submission.

## Success Criteria (prototype)

- All required items can be completed in a single guided flow.
- Auto-check failure provides a clear retry reason.
- Installers understand what to capture without code language.

## Risks

- Over-scoping the checklist for a v1 prototype.
- Ambiguity in acceptable imagery without real-time feedback.

## Branding Notes

Visual style should feel consistent with SolarAPP+ (light, calm UI, blue panels, orange primary actions), adapted to a mobile-first experience.

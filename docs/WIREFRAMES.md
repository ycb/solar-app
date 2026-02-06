# Wireframes - Installer Capture (v1)

Purpose: define wireframe-level content and states for the 3-5 screen mobile flow.

Navigation: linear flow with Back/Next actions (no tabs).

## Screen 1 - Job Overview / Start

Header
- SolarAPP+ logo
- Project name: 123 Oak Street - Final Inspection
- Status pill: Not started / In progress / Complete

Project summary card
- Address + jurisdiction
- System type: Rooftop PV + Battery
- Installer: ABC Solar
- Required captures: 7
- Progress: 0/7

Permitted equipment summary (from docs/PROJECT_DEFAULTS.md)
- PV modules: 20 x ~400W residential rooftop modules
- Inverter: Hybrid inverter (Energy Hub class)
- Battery: 1 x wall-mounted battery (Powerwall class)
- Main service panel: Existing 200A
- Disconnects: PV AC + ESS

Primary actions
- Start capture (primary)
- View checklist (secondary)

Footer note
- Plain-language reminder: Capture photos or videos exactly as prompted. The app auto-checks clarity.

## Screen 2 - Checklist + Progress

Header
- Title: Capture Checklist
- Progress bar: 2/7 captured
- Pass/fail state: Incomplete / Complete

Checklist items (each row)
- Title
- Short prompt
- Capture type pill: Photo or Video
- Status chip: Pending / Captured / Accepted / Retry
- CTA: Capture (or Retake if Retry)

Checklist content (required)
1. Array context + attachment - Video
2. Inverter identity + clearance - Photo
3. Battery location + clearance - Photo
4. PV + ESS disconnects - Photo
5. Fire access pathways - Photo
6. Labels / placards - Photo
7. Main service panel - Photo

Bottom sticky bar
- Remaining count
- Continue (next pending task)

## Screen 3 - Current Task (One-at-a-time focus)

Header
- Task title (e.g., Array context + attachment)
- Capture type pill (Video or Photo)
- Step indicator: 7 of 7

Guidance panel
- What to capture (1-2 sentences)
- What good looks like (bullets)
- Duration hint when video is required (10-20 sec)
- Reminder: retake if text unreadable

Automated check result (inline)
- If auto-check fails, show the specific problem and the fix (e.g., "Label not readable - move closer and retake").

Capture controls
- Primary: Start capture
- Secondary: Skip for now (optional)

Example helper (optional, placeholder)
- Illustration or text callout showing framing

## Screen 4 - Review + Readiness

Header
- Title: Review captures
- Pass/fail badge: Incomplete / Complete
- Missing items count

Media grid
- Thumbnails
- Clear photo vs video indicator on each tile
- Status chip per tile (Accepted / Retry / Captured)
- Retake button on Retry tiles

Error state (required example)
- At least one tile should be in Retry
- Retry reason helper text (from auto-check) (e.g., "Label not readable" or "Clearance not visible")
- Primary action on that tile: Retake capture

Readiness checklist (pass/fail criteria)
- Equipment matches permitted list
- Electrical connections verified
- Fire access pathways visible
- Workmanship acceptable

Primary action
- Mark Complete (disabled until all required items are Accepted)

## Screen 5 - Submit

Header
- Title: Complete
- Status: Pass

Summary
- 7/7 accepted
- Includes 1 video

Primary action
- Submit for inspection

Secondary action
- Export package (optional placeholder)

## State Model (shared)

Per item
- Pending: not started
- Captured: media captured, awaiting auto-check
- Accepted: auto-check passed clarity/coverage
- Retry: auto-check failed; needs new capture

Overall
- Not started: 0 accepted or captured
- In progress: any item accepted or captured, but not all accepted
- Complete: all items Accepted

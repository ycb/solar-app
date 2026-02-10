# Wireframes - Installer Capture (v1)

Purpose: define wireframe-level content and states for the expanded mobile flow.

Navigation: linear, one task at a time. The user returns to the task hub after every capture.

## Screen 1 - Projects List

Tabs
- Pending (active)
- Complete

Columns
- Address
- Date
- Type
- Size
- Status

Statuses to show (one project each)
- Inspection Pending
- Photos Needed (active row, bold)
- Wiring
- Mounting
- Permit
- Design

CTA
- Only the Photos Needed row is clickable.

## Screen 2 - Project Details

Project details
- Customer name + address
- Type (PV or PV + Storage)
- Jurisdiction
- System size
- DC and AC

Equipment list (two columns)
- (10) Q.PEAK DUO BLK-6X+ 340 Solar Modules
- (10) IQ7-60-US-2 [240V] Microinverters
- (1) Tesla Powerwall
- (1) AC Battery Inverter
- (1) Racking
- (1) Disconnects (PV + ESS)
- (1) Labels and Placards
- (1) Conduit

Primary CTA
- Start (or Continue) Capture

## Screen 3 - Capture Overview (Entry)

Header
- Project name: 123 Oak Street - Final Inspection
- Address + system type
- Installer: ABC Solar

Checklist items (each row)
- Title
- Status: Not started / In progress / Complete
- Required media type: Photo or Video
- Count (e.g., "2 photos captured")
- Tap to open the capture hub

Checklist content (required)
1. Racking + Array (substeps below)
2. Inverter identity + clearance
3. Battery location + clearance
4. PV + ESS disconnects
5. Labels / placards
6. Main service panel
7. Conduit + wiring

## Screen 4 - Step-level Overview

Accordion (opened to first incomplete step)
Example for Racking + Array

I. Roof penetrations: (2) photos per attachment
	•	Photo 1: Close-up (12–18 inches away perpendicular to flashing/penetration)
	•	Photo 2: Step back 3–6 feet to show attachment location relative to rail line
	Acceptance criteria:
	•	Flashing fully visible, not cut off
	•	No blur; edges sharp
	•	Roof material around penetration visible (tiles/shingles)
	•	If tiles: show any tile replacement/fit around flashing

II. Array edge alignment

III. Array perimeter

CTA
- Start (or Continue) capture for the selected substep

## Screen 5 - Capture Task Overview (Persistent hub)

This is the anchor screen for a capture group. The user returns here after every capture.

Content
- Clear instruction in plain language
  Example: "Capture a photo of each roof penetration where racking connects to the roof."
- Thumbnail grid (0 -> n photos)
- Counter (e.g., "0 of required captured")
- Primary CTA: Add photo / Add video
- Secondary CTA: Done (disabled until minimum accepted)

## Screen 6 - Camera (Minimal)

No extra chrome.
- Shutter button
- Cancel (returns to Screen 2 without capture)

After capture -> auto-advance to validation.

## Screen 7 - Inline Processing / Validation (Transient)

This should feel fast and non-blocking.

State: Checking
- Spinner
- "Checking photo quality..."

Outcome A: Accepted
- Subtle success state (green check)
- "Photo accepted"
- Auto-returns to Screen 2

Outcome B: Needs retry
- Specific feedback (e.g., "Image is blurry - steady the camera or move closer")
- Primary: Retake photo (returns to Camera)
- Secondary: Cancel (returns to Screen 2, photo discarded)

## Screen 2 (again) - Now with progress

- Thumbnails visible
- Count updated
- Done enabled once minimum is accepted
- User can add another capture or mark step complete

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

# Solar Install Capture Prototype

Demo: https://sa.peterspannagle.com/

Mobile-first prototype that guides solar installers through a linear pre‑inspection capture flow. It enforces photo/video requirements, simulates an auto‑check, and provides a simple inspection‑readiness state before submission.

## What This Prototype Covers

- Linear flow: Projects → Project Details → Capture Overview → Capture Task → Camera → Validation
- 7 capture groups with Racking + Array substeps (photos + 2 videos)
- Auto-check simulation with a single retry and then accept
- Status chips, breadcrumbs for navigation, and inline capture tips

## Evidence Required (v1)

1. Racking + Array
   - Roof penetrations (photo series)
   - Array edge alignment (video)
   - Array perimeter setback (video)
2. Inverter identity + clearance (photo)
3. Battery location + clearance (photo)
4. PV + ESS disconnects (photo)
5. Labels / placards (photo)
6. Main service panel (photo)
7. Conduit + wiring (photo)

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- TypeScript
- Vite PWA plugin (generateSW)

## Getting Started

```bash
npm install
npm run dev
```

Build + preview:

```bash
npm run build
npm run preview
```

Type check:

```bash
npm run typecheck
```

## Assets

Sample capture images live in `public/assets/` and are referenced from `src/App.tsx` in `sampleMediaBySubstep`.

- `public/assets/edge.png` — Array edge alignment
- `public/assets/setback.png` — Array perimeter setback

Update or replace those files to change the preview thumbnails.

## Deployment (FTP)

Upload the **contents** of `dist/` to your FTP web root. Do not upload the repo source.

## Key Docs

- `docs/PRD.md`
- `docs/PRODUCT_GOALS.md`
- `docs/BASELINE.md`
- `docs/WIREFRAMES.md`
- `docs/execplan/installer-capture-prototype.md`
- `docs/RACKING-ARRAY.md`

## Notes

This is an internal prototype. It does not include backend services, auth, or real compliance validation.

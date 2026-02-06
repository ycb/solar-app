import { useState } from 'react';

type CaptureStatus = 'pending' | 'captured' | 'accepted' | 'retry';
type CaptureType = 'Photo' | 'Video';

type CaptureItem = {
  id: string;
  title: string;
  detail: string;
  media: CaptureType;
  status: CaptureStatus;
  issue?: string;
};

type Guidance = {
  capture: string;
  good: string[];
  duration?: string;
};

type ScreenId = 'overview' | 'checklist' | 'capture' | 'review' | 'submit';

const screens: { id: ScreenId; label: string; helper: string }[] = [
  { id: 'overview', label: 'Job Overview', helper: 'Project summary and requirements' },
  { id: 'checklist', label: 'Checklist', helper: 'Required evidence and status' },
  { id: 'capture', label: 'Capture', helper: 'One task at a time' },
  { id: 'review', label: 'Review', helper: 'Auto-check results and readiness' },
  { id: 'submit', label: 'Submit', helper: 'Package for inspection' }
];

const project = {
  name: '123 Oak Street - Solar + Battery Final Inspection',
  address: '123 Oak Street, Lemon Grove, CA',
  jurisdiction: 'California AHJ baseline',
  installer: 'ABC Solar',
  inspection: 'Final inspection (PV + ESS)',
  system: 'Rooftop PV + wall-mounted battery'
};

const equipmentSummary = [
  'PV modules: 20 x ~400W residential rooftop modules',
  'Inverter: Hybrid inverter (Energy Hub class)',
  'Battery: 1 x wall-mounted battery (Powerwall class)',
  'Main service panel: Existing 200A',
  'Disconnects: PV AC + ESS'
];

const captureItems: CaptureItem[] = [
  {
    id: 'array',
    title: 'Array context + attachment',
    detail: 'Show array placement, setbacks, and one attachment detail.',
    media: 'Video',
    status: 'pending'
  },
  {
    id: 'inverter',
    title: 'Inverter identity + clearance',
    detail: 'Capture nameplate and working clearances in a single frame.',
    media: 'Photo',
    status: 'captured'
  },
  {
    id: 'battery',
    title: 'Battery location + clearance',
    detail: 'Show final placement and wall or ceiling clearances.',
    media: 'Photo',
    status: 'retry',
    issue: 'Clearance not visible. Step back and retake.'
  },
  {
    id: 'disconnects',
    title: 'PV + ESS disconnects',
    detail: 'Show both disconnects with labels in context.',
    media: 'Photo',
    status: 'accepted'
  },
  {
    id: 'fire',
    title: 'Fire access pathways',
    detail: 'Capture 3 ft clearance where required with context.',
    media: 'Photo',
    status: 'pending'
  },
  {
    id: 'labels',
    title: 'Labels / placards',
    detail: 'Rapid shutdown, ESS warning, and main service placards.',
    media: 'Photo',
    status: 'pending'
  },
  {
    id: 'panel',
    title: 'Main service panel',
    detail: 'Exterior panel and interior breaker labeling.',
    media: 'Photo',
    status: 'pending'
  }
];

const guidanceById: Record<string, Guidance> = {
  array: {
    capture: 'Show the full array and one attachment or racking detail.',
    good: ['Include roof edges and setbacks', 'Show racking close-up', 'Keep labels readable'],
    duration: '10-20 seconds, wide to close'
  },
  inverter: {
    capture: 'Capture the inverter nameplate and working clearances.',
    good: ['Nameplate is legible', 'Clearances visible on all sides', 'Show conduit entry']
  },
  battery: {
    capture: 'Capture final battery placement and clearances.',
    good: ['Show wall and ceiling clearance', 'Nameplate readable', 'Include ESS disconnect']
  },
  disconnects: {
    capture: 'Show PV and ESS disconnects with labels in context.',
    good: ['Both disconnects visible', 'Labels readable', 'Context to inverter or panel']
  },
  fire: {
    capture: 'Show fire access pathways and required clearance.',
    good: ['Clear 3 ft path shown', 'Context to roof area', 'No obstructions visible']
  },
  labels: {
    capture: 'Capture required placards and rapid shutdown labels.',
    good: ['Placards readable', 'Labels match equipment', 'Include panel placard']
  },
  panel: {
    capture: 'Capture main service panel exterior and breaker labeling.',
    good: ['Panel exterior in frame', 'Breaker directory readable', 'PV and ESS placards visible']
  }
};

const statusConfig: Record<CaptureStatus, { label: string; dot: string; pill: string }> = {
  pending: { label: 'Pending', dot: 'bg-ink/30', pill: 'bg-ink/5 text-dusk' },
  captured: { label: 'Captured', dot: 'bg-sun', pill: 'bg-sun/15 text-dusk' },
  accepted: { label: 'Accepted', dot: 'bg-fern', pill: 'bg-mint text-fern' },
  retry: { label: 'Retry', dot: 'bg-rose-500', pill: 'bg-rose-100 text-rose-700' }
};

const readinessCriteria = [
  'Equipment matches permitted list',
  'Electrical connections verified',
  'Fire access pathways visible',
  'Workmanship acceptable'
];

const mediaClass = (media: CaptureType) =>
  media === 'Video' ? 'bg-ocean text-white' : 'bg-sky text-ocean';

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const screen = screens[screenIndex] ?? screens[0];

  const totalItems = captureItems.length;
  const acceptedCount = captureItems.filter((item) => item.status === 'accepted').length;
  const attemptedCount = captureItems.filter((item) => item.status !== 'pending').length;
  const progressPercent = Math.round((attemptedCount / totalItems) * 100);
  const overallStatus =
    attemptedCount === 0 ? 'Not started' : acceptedCount === totalItems ? 'Complete' : 'In progress';
  const passFail = acceptedCount === totalItems ? 'Complete' : 'Incomplete';
  const currentIndex = captureItems.findIndex(
    (item) => item.status === 'retry' || item.status === 'pending'
  );
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentItem = captureItems[safeIndex];
  const nextPending =
    captureItems.find((item) => item.status === 'pending' || item.status === 'retry') ??
    captureItems[0];
  const canMarkComplete = acceptedCount === totalItems;
  const isFirstScreen = screenIndex === 0;
  const isLastScreen = screenIndex === screens.length - 1;
  const missingCount = totalItems - acceptedCount;
  const guidance = guidanceById[currentItem.id] ?? guidanceById.array;
  const photoCount = captureItems.filter((item) => item.media === 'Photo').length;
  const videoCount = captureItems.filter((item) => item.media === 'Video').length;

  const goNext = () => setScreenIndex((index) => Math.min(index + 1, screens.length - 1));
  const goBack = () => setScreenIndex((index) => Math.max(index - 1, 0));

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Project Summary</p>
          <h2 className="mt-2 font-display text-2xl">{project.name}</h2>
          <p className="mt-1 text-sm text-dusk/70">{project.address}</p>
          <div className="mt-4 grid gap-2 text-xs text-dusk/80">
            <div className="flex items-center justify-between rounded-xl bg-cloud px-3 py-2">
              <span>Jurisdiction</span>
              <span className="font-semibold">{project.jurisdiction}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-cloud px-3 py-2">
              <span>Installer</span>
              <span className="font-semibold">{project.installer}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-cloud px-3 py-2">
              <span>Inspection</span>
              <span className="font-semibold">{project.inspection}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-cloud px-3 py-2">
              <span>System</span>
              <span className="font-semibold">{project.system}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Status</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-3xl">{overallStatus}</p>
            <span className="rounded-full bg-sky px-3 py-1 text-xs font-semibold text-ocean">
              {attemptedCount}/{totalItems} captured
            </span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-ink/5">
            <div className="h-2 rounded-full bg-ocean" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-ocean px-3 py-1 font-semibold text-white">
              {videoCount} video required
            </span>
            <span className="rounded-full bg-sky px-3 py-1 font-semibold text-ocean">
              {photoCount} photos required
            </span>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">Array = video</span>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">Main panel = photo</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">
          Permitted Equipment Summary
        </p>
        <ul className="mt-3 space-y-2 text-sm text-dusk">
          {equipmentSummary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Required Captures</p>
            <p className="mt-2 text-sm text-dusk/70">
              Seven evidence groups. Auto-check must accept each capture.
            </p>
          </div>
          <button
            className="rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold text-dusk"
            onClick={() => setScreenIndex(1)}
          >
            View checklist
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {captureItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-ink/10 bg-cloud px-3 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{item.title}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${mediaClass(
                    item.media
                  )}`}
                >
                  {item.media}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-dusk/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-sun px-5 py-2 text-xs font-semibold text-white shadow-soft"
          onClick={() => setScreenIndex(1)}
        >
          Start capture
        </button>
        <button
          className="rounded-full border border-ink/10 bg-white px-5 py-2 text-xs font-semibold text-dusk"
          onClick={() => setScreenIndex(1)}
        >
          Review checklist
        </button>
      </div>

      <p className="text-xs text-dusk/70">
        Capture photos or videos exactly as prompted. The app auto-checks clarity and coverage.
      </p>
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Capture Checklist</h2>
            <p className="mt-1 text-sm text-dusk/70">
              Each item specifies capture type. Complete all items to pass.
            </p>
          </div>
          <div className="text-right text-xs text-dusk/70">
            <p className="font-semibold text-dusk">
              {attemptedCount}/{totalItems} captured
            </p>
            <p>Pass/Fail: {passFail}</p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-ink/5">
          <div className="h-2 rounded-full bg-ocean" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {captureItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-dusk/70">{item.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${mediaClass(
                    item.media
                  )}`}
                >
                  {item.media}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    statusConfig[item.status].pill
                  }`}
                >
                  {statusConfig[item.status].label}
                </span>
                <button
                  className="rounded-full border border-ink/10 px-3 py-1 text-[11px] font-semibold text-dusk/80"
                  onClick={() => setScreenIndex(2)}
                >
                  {item.status === 'retry' ? 'Retake' : 'Capture'}
                </button>
              </div>
            </div>
            {item.status === 'retry' && item.issue ? (
              <p className="mt-2 text-[11px] text-rose-700">{item.issue}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-semibold text-dusk">Next up</p>
            <p className="text-dusk/70">
              {nextPending.title} - {nextPending.media}
            </p>
          </div>
          <button
            className="rounded-full bg-sun px-4 py-2 font-semibold text-white"
            onClick={() => setScreenIndex(2)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderCapture = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Current Task</p>
            <h2 className="mt-2 font-display text-2xl">{currentItem.title}</h2>
            <p className="mt-1 text-sm text-dusk/70">{guidance.capture}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${mediaClass(
                currentItem.media
              )}`}
            >
              {currentItem.media}
            </span>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-semibold text-dusk">
              Item {safeIndex + 1} of {totalItems}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">What good looks like</p>
        <ul className="mt-3 space-y-2 text-sm text-dusk/80">
          {guidance.good.map((step) => (
            <li key={step} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-ocean" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
        {guidance.duration ? (
          <div className="mt-3 rounded-xl bg-sky px-3 py-2 text-xs text-ocean">
            Video required: {guidance.duration}.
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Auto-check Result</p>
        {currentItem.status === 'retry' && currentItem.issue ? (
          <div className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-xs text-rose-700">
            Auto-check failed: {currentItem.issue}
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-mint px-3 py-2 text-xs text-fern">
            Auto-check runs after capture and confirms clarity and coverage.
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full bg-sun px-5 py-2 text-xs font-semibold text-white">
            {currentItem.media === 'Video' ? 'Start video capture' : 'Take photo'}
          </button>
          <button className="rounded-full border border-ink/10 bg-white px-5 py-2 text-xs font-semibold text-dusk">
            Need help
          </button>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Review Captures</h2>
            <p className="mt-1 text-sm text-dusk/70">
              Accepted is set only after the auto-check passes minimum standards.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              passFail === 'Complete' ? 'bg-mint text-fern' : 'bg-sun/15 text-dusk'
            }`}
          >
            {passFail}
          </span>
        </div>
        <p className="mt-3 text-xs text-dusk/70">
          {acceptedCount}/{totalItems} accepted. {missingCount} remaining.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {captureItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{item.title}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${mediaClass(
                  item.media
                )}`}
              >
                {item.media}
              </span>
            </div>
            <div className="mt-3 h-20 rounded-xl border border-dashed border-ink/10 bg-cloud/60">
              <div className="flex h-full items-center justify-center text-[10px] text-dusk/50">
                Thumbnail preview
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-dusk/70">
              <span className={`h-2 w-2 rounded-full ${statusConfig[item.status].dot}`} />
              {statusConfig[item.status].label}
            </div>
            {item.status === 'retry' && item.issue ? (
              <div className="mt-2 text-[11px] text-rose-700">{item.issue}</div>
            ) : null}
            {item.status === 'retry' ? (
              <button className="mt-3 rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] font-semibold text-dusk">
                Retake
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Readiness</p>
        <p className="mt-2 font-display text-3xl text-ink">{passFail}</p>
        <div className="mt-4 space-y-2 text-xs">
          {readinessCriteria.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl bg-cloud px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-sun" />
              {item}
            </div>
          ))}
        </div>
        <button
          className="mt-5 w-full rounded-full bg-ocean px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canMarkComplete}
        >
          Mark Complete
        </button>
      </div>
    </div>
  );

  const renderSubmit = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Complete</p>
        <h2 className="mt-2 font-display text-3xl">Pre-inspection package</h2>
        <p className="mt-2 text-sm text-dusk/70">
          {acceptedCount}/{totalItems} accepted. Status: {passFail}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-sky px-3 py-1 font-semibold text-ocean">
            Includes {videoCount} video
          </span>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">
            {totalItems} capture groups
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-sun px-5 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canMarkComplete}
          >
            Submit for inspection
          </button>
          <button
            className="rounded-full border border-ink/10 bg-white px-5 py-2 text-xs font-semibold text-dusk"
            onClick={() => setScreenIndex(0)}
          >
            Back to overview
          </button>
        </div>
      </div>
    </div>
  );

  const renderScreenBody = () => {
    if (screen.id === 'overview') return renderOverview();
    if (screen.id === 'checklist') return renderChecklist();
    if (screen.id === 'capture') return renderCapture();
    if (screen.id === 'review') return renderReview();
    return renderSubmit();
  };

  return (
    <main className="min-h-screen bg-cloud text-ink">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[680px] -translate-x-1/2 rounded-full bg-sky/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-[320px] w-[320px] rounded-full bg-mint/60 blur-3xl" />

        <header className="relative border-b border-ink/10 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-soft">
                <img src="/assets/logo.svg" alt="SolarAPP+ logo" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dusk/70">SolarAPP+</p>
                <p className="font-display text-lg">Installer Capture</p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-dusk/80 md:flex">
              <span>Projects</span>
              <span>Jurisdiction</span>
              <span>Help Center</span>
            </nav>
            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-fern" />
              Bailey V.
            </div>
          </div>
        </header>

        <section className="relative mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-3xl border border-ink/10 bg-white/90 p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Inspection Flow</p>
                <h1 className="mt-2 font-display text-3xl">Pre-inspection capture</h1>
                <p className="mt-1 text-sm text-dusk/70">
                  Linear flow with auto-check enforced acceptance.
                </p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-cloud px-4 py-3 text-xs text-dusk/70">
                <p className="font-semibold text-dusk">
                  Step {screenIndex + 1} of {screens.length}
                </p>
                <p>{screen.label}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {screens.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    index === screenIndex
                      ? 'bg-ocean text-white'
                      : index < screenIndex
                      ? 'bg-mint text-fern'
                      : 'bg-ink/5 text-dusk'
                  }`}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-soft">
            {renderScreenBody()}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-xs shadow-soft">
            <button
              className="rounded-full border border-ink/10 bg-white px-4 py-2 font-semibold text-dusk disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goBack}
              disabled={isFirstScreen}
            >
              Back
            </button>
            <div className="text-center text-dusk/70">
              {attemptedCount}/{totalItems} captured - {overallStatus}
            </div>
            <button
              className="rounded-full bg-sun px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goNext}
              disabled={isLastScreen}
            >
              {screens[Math.min(screenIndex + 1, screens.length - 1)].label}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

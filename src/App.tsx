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

type ScreenId = 'overview' | 'checklist' | 'capture' | 'review' | 'submit';

const screens: { id: ScreenId; label: string }[] = [
  { id: 'overview', label: 'Job Overview' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'capture', label: 'Capture' },
  { id: 'review', label: 'Review' },
  { id: 'submit', label: 'Submit' }
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
    detail: 'Show final placement and wall/ceiling clearances.',
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

const statusConfig: Record<CaptureStatus, { label: string; dot: string; pill: string }> = {
  pending: { label: 'Pending', dot: 'bg-ink/30', pill: 'bg-ink/5 text-dusk' },
  captured: { label: 'Captured', dot: 'bg-sun', pill: 'bg-sun/15 text-dusk' },
  accepted: { label: 'Accepted', dot: 'bg-fern', pill: 'bg-mint text-fern' },
  retry: { label: 'Retry', dot: 'bg-rose-500', pill: 'bg-rose-100 text-rose-700' }
};

const guidanceSteps = [
  'Start with a wide shot for context.',
  'Move closer for nameplates and labels.',
  'Show clearances in the same frame.',
  'Retake if any text is unreadable.'
];

const readinessCriteria = [
  'Equipment matches permitted list',
  'Electrical connections verified',
  'Fire access pathways visible',
  'Workmanship acceptable'
];

const nextLabels: Record<ScreenId, string> = {
  overview: 'Start capture',
  checklist: 'Go to capture',
  capture: 'Review captures',
  review: 'Submit',
  submit: 'Done'
};

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
  const canMarkComplete = acceptedCount === totalItems;
  const isFirstScreen = screenIndex === 0;
  const isLastScreen = screenIndex === screens.length - 1;

  const goNext = () => setScreenIndex((index) => Math.min(index + 1, screens.length - 1));
  const goBack = () => setScreenIndex((index) => Math.max(index - 1, 0));

  const renderScreenBody = () => {
    if (screen.id === 'overview') {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Project Summary</p>
            <h2 className="mt-2 font-display text-2xl">123 Oak Street - Final Inspection</h2>
            <p className="mt-1 text-sm text-dusk/70">Lemon Grove, CA - Rooftop PV + Battery</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">
                Required captures: {totalItems}
              </span>
              <span className="rounded-full bg-sky px-3 py-1 font-semibold text-ocean">
                {attemptedCount}/{totalItems} captured
              </span>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">{overallStatus}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">
              Permitted Equipment Summary
            </p>
            <ul className="mt-3 space-y-2 text-sm text-dusk">
              <li>PV modules: 20 x ~400W residential rooftop modules</li>
              <li>Inverter: Hybrid inverter (Energy Hub class)</li>
              <li>Battery: 1 x wall-mounted battery (Powerwall class)</li>
              <li>Main service panel: Existing 200A</li>
              <li>Disconnects: PV AC + ESS</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Required Media</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-ocean px-3 py-1 font-semibold text-white">
                1 video required
              </span>
              <span className="rounded-full bg-sky px-3 py-1 font-semibold text-ocean">
                6 photos required
              </span>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">Array = video</span>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">Main panel = photo</span>
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
              View checklist
            </button>
          </div>

          <p className="text-xs text-dusk/70">
            Capture photos or videos exactly as prompted. The app auto-checks clarity and coverage.
          </p>
        </div>
      );
    }

    if (screen.id === 'checklist') {
      return (
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
              <div
                className="h-2 rounded-full bg-ocean"
                style={{ width: `${progressPercent}%` }}
              />
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
        </div>
      );
    }

    if (screen.id === 'capture') {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Current Task</p>
                <h2 className="mt-2 font-display text-2xl">{currentItem.title}</h2>
                <p className="mt-1 text-sm text-dusk/70">{currentItem.detail}</p>
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
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Capture Guidance</p>
            <ul className="mt-3 space-y-2 text-sm text-dusk/80">
              {guidanceSteps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-ocean" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            {currentItem.media === 'Video' ? (
              <div className="mt-3 rounded-xl bg-sky px-3 py-2 text-xs text-ocean">
                Video required: 10-20 seconds with multiple angles.
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
                Skip for now
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (screen.id === 'review') {
      return (
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
              {acceptedCount}/{totalItems} accepted. {totalItems - acceptedCount} remaining.
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
                <div className="mt-3 h-16 rounded-xl border border-dashed border-ink/10 bg-cloud/60" />
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
    }

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Complete</p>
          <h2 className="mt-2 font-display text-3xl">Pre-inspection package</h2>
          <p className="mt-2 text-sm text-dusk/70">
            {acceptedCount}/{totalItems} accepted. Status: {passFail}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-sky px-3 py-1 font-semibold text-ocean">
              Includes 1 video
            </span>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-dusk">7 capture groups</span>
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
              {nextLabels[screen.id]}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

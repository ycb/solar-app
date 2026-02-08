import { useEffect, useMemo, useState } from 'react';

type ScreenId = 'projects' | 'details' | 'overview' | 'step' | 'task' | 'camera' | 'validation';
type CaptureType = 'Photo' | 'Video';

type Project = {
  id: string;
  address: string;
  date: string;
  type: 'PV' | 'PV + Storage';
  size: string;
  status: string;
  active?: boolean;
};

type Substep = {
  id: string;
  title: string;
  media: CaptureType;
  requiredMin: number;
  summary: string;
  capture: string;
  acceptance: string[];
};

type Step = {
  id: string;
  title: string;
  substeps: Substep[];
};

type CaptureRecord = {
  id: string;
  accepted: boolean;
  imageUrl?: string;
};

const pendingProjects: Project[] = [
  {
    id: 'p-1',
    address: '8223 Blossom Hill Ct, Lemon Grove, CA',
    date: 'Feb 06',
    type: 'PV + Storage',
    size: '8.2 kW',
    status: 'Inspection Pending'
  },
  {
    id: 'p-2',
    address: '123 Oak Street, Lemon Grove, CA',
    date: 'Feb 06',
    type: 'PV + Storage',
    size: '6.4 kW',
    status: 'Photos Needed',
    active: true
  },
  {
    id: 'p-3',
    address: '44 Arbor Ridge Dr, San Diego, CA',
    date: 'Feb 05',
    type: 'PV',
    size: '5.1 kW',
    status: 'Wiring'
  },
  {
    id: 'p-4',
    address: '18 Canyon Trail, San Diego, CA',
    date: 'Feb 05',
    type: 'PV',
    size: '4.7 kW',
    status: 'Mounting'
  },
  {
    id: 'p-5',
    address: '901 Maple Ave, La Mesa, CA',
    date: 'Feb 04',
    type: 'PV + Storage',
    size: '7.0 kW',
    status: 'Permit'
  },
  {
    id: 'p-6',
    address: '17 Palm Court, Chula Vista, CA',
    date: 'Feb 03',
    type: 'PV',
    size: '5.9 kW',
    status: 'Design'
  }
];

const completedProjects: Project[] = [
  {
    id: 'c-1',
    address: '714 Sierra Way, El Cajon, CA',
    date: 'Feb 02',
    type: 'PV',
    size: '4.2 kW',
    status: 'Complete'
  }
];

const equipmentList = [
  { count: 10, name: 'Q.PEAK DUO BLK-6X+ 340 Solar Modules' },
  { count: 10, name: 'IQ7-60-US-2 [240V] Microinverters' },
  { count: 1, name: 'Tesla Powerwall' },
  { count: 1, name: 'AC Battery Inverter' },
  { count: 1, name: 'Racking' },
  { count: 1, name: 'Disconnects (PV + ESS)' },
  { count: 1, name: 'Labels and Placards' },
  { count: 1, name: 'Conduit' }
];

const steps: Step[] = [
  {
    id: 'racking',
    title: 'Racking + Array',
    substeps: [
      {
        id: 'penetrations',
        title: 'Roof penetrations',
        media: 'Photo',
        requiredMin: 2,
        summary: '(2) photos per attachment',
        capture:
          'Capture a photo of each roof penetration where racking connects to the roof.',
        acceptance: [
          'Flashing fully visible, not cut off',
          'No blur; edges sharp',
          'Roof material around penetration visible',
          'If tiles: show any tile replacement/fit around flashing'
        ]
      },
      {
        id: 'edge',
        title: 'Array edge alignment',
        media: 'Video',
        requiredMin: 1,
        summary: '(1) video sweep',
        capture: 'Capture a steady edge-on sweep showing the module plane.',
        acceptance: ['Keep the array edge centered', 'Move slowly', 'Show a consistent plane']
      },
      {
        id: 'perimeter',
        title: 'Array perimeter setback',
        media: 'Video',
        requiredMin: 1,
        summary: '(1) video sweep',
        capture: 'Capture a top-down sweep showing the 3 ft setback around the array.',
        acceptance: ['Show roof edges and setbacks', 'One continuous sweep', 'Clear lighting']
      }
    ]
  },
  {
    id: 'inverter',
    title: 'Inverter',
    substeps: [
      {
        id: 'inverter-id',
        title: 'Inverter nameplate + clearance',
        media: 'Photo',
        requiredMin: 1,
        summary: '(1) photo',
        capture: 'Capture the inverter nameplate and working clearances.',
        acceptance: ['Nameplate legible', 'Clearances visible on all sides']
      }
    ]
  },
  {
    id: 'battery',
    title: 'Battery',
    substeps: [
      {
        id: 'battery-id',
        title: 'Battery placement',
        media: 'Photo',
        requiredMin: 1,
        summary: '(1) photo',
        capture: 'Capture final battery placement and wall or ceiling clearances.',
        acceptance: ['Clearances visible', 'Nameplate readable']
      }
    ]
  },
  {
    id: 'disconnects',
    title: 'Disconnects',
    substeps: [
      {
        id: 'disconnects-id',
        title: 'Disconnects',
        media: 'Photo',
        requiredMin: 1,
        summary: '(1) photo',
        capture: 'Show both disconnects with labels in context.',
        acceptance: ['Labels readable', 'Both disconnects visible']
      }
    ]
  },
  {
    id: 'labels',
    title: 'Labels + placards',
    substeps: [
      {
        id: 'labels-id',
        title: 'Placards + warnings',
        media: 'Photo',
        requiredMin: 2,
        summary: '(2) photos',
        capture: 'Capture rapid shutdown, ESS warning, and main service placards.',
        acceptance: ['Placards readable', 'All required labels visible']
      }
    ]
  },
  {
    id: 'panel',
    title: 'Main service panel',
    substeps: [
      {
        id: 'panel-id',
        title: 'Panel exterior + breakers',
        media: 'Photo',
        requiredMin: 2,
        summary: '(2) photos',
        capture: 'Capture the panel exterior and breaker labeling.',
        acceptance: ['Breaker directory readable', 'PV/ESS placards visible']
      }
    ]
  },
  {
    id: 'conduit',
    title: 'Conduit + wiring',
    substeps: [
      {
        id: 'conduit-id',
        title: 'Conduit routing',
        media: 'Photo',
        requiredMin: 1,
        summary: '(1) photo',
        capture: 'Capture conduit routing from array to equipment.',
        acceptance: ['Routing visible', 'No loose wiring']
      }
    ]
  }
];

const sampleMediaBySubstep: Record<string, string[]> = {
  penetrations: [
    'https://images.pexels.com/photos/9875421/pexels-photo-9875421.jpeg?cs=srgb&dl=pexels-kindelmedia-9875421.jpg&fm=jpg'
  ],
  edge: [
    '/assets/edge.png'
  ],
  perimeter: [
    '/assets/setback.png'
  ],
  'inverter-id': [
    'https://images.pexels.com/photos/33751639/pexels-photo-33751639.jpeg?cs=srgb&dl=pexels-elite-power-group-661996115-33751639.jpg&fm=jpg'
  ],
  'battery-id': [
    'https://images.pexels.com/photos/33751679/pexels-photo-33751679.jpeg?cs=srgb&dl=pexels-elite-power-group-661996115-33751679.jpg&fm=jpg'
  ],
  'disconnects-id': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Utility_Disconnect_Switch.png/500px-Utility_Disconnect_Switch.png'
  ],
  'labels-id': ['https://upload.wikimedia.org/wikipedia/commons/6/68/High_voltage.jpg'],
  'panel-id': [
    'https://images.pexels.com/photos/28950842/pexels-photo-28950842.jpeg?cs=srgb&dl=pexels-ranjeet-860714737-28950842.jpg&fm=jpg'
  ],
  'conduit-id': [
    'https://images.pexels.com/photos/29177620/pexels-photo-29177620.jpeg?cs=srgb&dl=pexels-victormoragriega-29177620.jpg&fm=jpg'
  ]
};

const initialCaptures: Record<string, CaptureRecord[]> = {
  'inverter-id': [
    { id: 'cap-1', accepted: true, imageUrl: sampleMediaBySubstep['inverter-id']?.[0] }
  ],
  'disconnects-id': [
    { id: 'cap-2', accepted: true, imageUrl: sampleMediaBySubstep['disconnects-id']?.[0] }
  ]
};

const statusLabel = (count: number, requiredMin: number) => {
  if (count === 0) return 'Not started';
  if (count < requiredMin) return 'In progress';
  return 'Complete';
};

const statusChipClasses = (status: string) => {
  if (status === 'Complete') return 'bg-mint text-fern';
  if (status === 'In progress') return 'bg-sun/15 text-dusk';
  if (status === 'Not started') return 'bg-ink/5 text-dusk/70';
  if (status === 'Photos Needed') return 'bg-sun/20 text-ink';
  if (status === 'Inspection Pending') return 'bg-ocean/15 text-ink';
  if (status === 'Wiring') return 'bg-ink/10 text-dusk';
  if (status === 'Mounting') return 'bg-ink/10 text-dusk';
  if (status === 'Permit') return 'bg-ink/10 text-dusk';
  if (status === 'Design') return 'bg-ink/10 text-dusk';
  return 'bg-ink/5 text-dusk/70';
};

const statusChipBase = 'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold';

const capturedLabel = (count: number, media: CaptureType) => {
  const noun = media.toLowerCase();
  const label = count === 1 ? noun : `${noun}s`;
  return `${count} ${label} captured`;
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('projects');
  const [tab, setTab] = useState<'pending' | 'complete'>('pending');
  const [activeProjectId, setActiveProjectId] = useState('p-2');
  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const [activeSubstepId, setActiveSubstepId] = useState(steps[0].substeps[0].id);
  const [openOverviewStepId, setOpenOverviewStepId] = useState(steps[0].id);
  const [capturesBySubstep, setCapturesBySubstep] =
    useState<Record<string, CaptureRecord[]>>(initialCaptures);
  const [captureSeed, setCaptureSeed] = useState(3);
  const [validationState, setValidationState] = useState<'checking' | 'accepted' | 'retry'>(
    'checking'
  );
  const [pendingOutcome, setPendingOutcome] = useState<'accepted' | 'retry'>('accepted');
  const [hasRetryOccurred, setHasRetryOccurred] = useState(false);

  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const activeSubstep =
    activeStep.substeps.find((substep) => substep.id === activeSubstepId) ??
    activeStep.substeps[0];
  const project = pendingProjects.find((item) => item.id === activeProjectId) ?? pendingProjects[0];
  const projectShortName = project.address.split(',')[0] ?? project.address;
  const breadcrumbItems = (() => {
    if (screen === 'projects') {
      return [{ label: 'All Projects' }];
    }
    if (screen === 'details') {
      return [
        { label: 'All Projects', onClick: () => setScreen('projects') },
        { label: projectShortName }
      ];
    }
    if (screen === 'overview') {
      return [
        { label: 'All Projects', onClick: () => setScreen('projects') },
        { label: projectShortName, onClick: () => setScreen('details') },
        { label: 'Capture Overview' }
      ];
    }
    if (screen === 'step') {
      return [
        { label: 'All Projects', onClick: () => setScreen('projects') },
        { label: projectShortName, onClick: () => setScreen('details') },
        { label: activeStep.title }
      ];
    }
    if (screen === 'task') {
      return [
        { label: 'All Projects', onClick: () => setScreen('projects') },
        { label: projectShortName, onClick: () => setScreen('details') },
        {
          label: activeStep.title,
          onClick: () => {
            setOpenOverviewStepId(activeStep.id);
            setScreen('overview');
          }
        },
        { label: activeSubstep.title }
      ];
    }
    return [
      { label: 'All Projects', onClick: () => setScreen('projects') },
      { label: projectShortName }
    ];
  })();

  const activeCount = capturesBySubstep[activeSubstep.id]?.length ?? 0;
  const nextIncompleteSubstep = (() => {
    const currentIndex = activeStep.substeps.findIndex((substep) => substep.id === activeSubstepId);
    if (currentIndex < 0) return undefined;
    return activeStep.substeps
      .slice(currentIndex + 1)
      .find(
        (substep) => (capturesBySubstep[substep.id]?.length ?? 0) < substep.requiredMin
      );
  })();
  const nextSampleImage = (() => {
    const list = sampleMediaBySubstep[activeSubstep.id] ?? [];
    if (list.length === 0) return '';
    return list[activeCount % list.length];
  })();
  const doneEnabled = activeCount >= activeSubstep.requiredMin;
  const isCameraMode = screen === 'camera' || screen === 'validation';

  const stepStatus = (step: Step) => {
    const substepStatuses = step.substeps.map((substep) => {
      const count = capturesBySubstep[substep.id]?.length ?? 0;
      return statusLabel(count, substep.requiredMin);
    });
    if (substepStatuses.every((status) => status === 'Not started')) return 'Not started';
    if (substepStatuses.every((status) => status === 'Complete')) return 'Complete';
    return 'In progress';
  };

  const firstIncompleteStepId = useMemo(() => {
    const step = steps.find((item) => stepStatus(item) !== 'Complete');
    return step?.id ?? steps[0].id;
  }, [capturesBySubstep]);

  useEffect(() => {
    setOpenOverviewStepId(firstIncompleteStepId);
  }, [firstIncompleteStepId]);

  useEffect(() => {
    if (screen !== 'validation') return;
    const checkTimer = setTimeout(() => {
      setValidationState(pendingOutcome);
    }, 600);

    let acceptTimer: number | undefined;
    if (pendingOutcome === 'accepted') {
      acceptTimer = window.setTimeout(() => {
        setCapturesBySubstep((prev) => {
          const next = { ...prev };
          const list = next[activeSubstep.id] ? [...next[activeSubstep.id]] : [];
          const sampleList = sampleMediaBySubstep[activeSubstep.id] ?? [];
          const imageUrl =
            sampleList.length > 0 ? sampleList[list.length % sampleList.length] : undefined;
          list.push({ id: `cap-${captureSeed}`, accepted: true, imageUrl });
          next[activeSubstep.id] = list;
          return next;
        });
        setCaptureSeed((seed) => seed + 1);
        setScreen('task');
      }, 1200);
    }

    return () => {
      clearTimeout(checkTimer);
      if (acceptTimer) clearTimeout(acceptTimer);
    };
  }, [screen, pendingOutcome, activeSubstep.id, captureSeed]);

  const handleShutter = () => {
    const outcome = hasRetryOccurred ? 'accepted' : 'retry';
    if (!hasRetryOccurred) {
      setHasRetryOccurred(true);
    }
    setPendingOutcome(outcome);
    setValidationState('checking');
    setScreen('validation');
  };

  const openStep = (stepId: string) => {
    setActiveStepId(stepId);
    const step = steps.find((item) => item.id === stepId) ?? steps[0];
    setActiveSubstepId(step.substeps[0].id);
    setScreen('step');
  };

  const openSubstep = (substepId: string) => {
    const parentStep = steps.find((step) =>
      step.substeps.some((substep) => substep.id === substepId)
    );
    if (parentStep) {
      setActiveStepId(parentStep.id);
    }
    setActiveSubstepId(substepId);
    setScreen('task');
  };

  const renderProjects = () => {
    const rows = tab === 'pending' ? pendingProjects : completedProjects;
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-3xl">Installations</h1>
        </header>

        <div className="flex gap-3 text-sm">
          <button
            className={`rounded-full px-4 py-2 font-semibold ${
              tab === 'pending' ? 'bg-ink text-white' : 'border border-ink/10 text-dusk'
            }`}
            onClick={() => setTab('pending')}
          >
            Pending
          </button>
          <button
            className={`rounded-full px-4 py-2 font-semibold ${
              tab === 'complete' ? 'bg-ink text-white' : 'border border-ink/10 text-dusk'
            }`}
            onClick={() => setTab('complete')}
          >
            Complete
          </button>
        </div>

        <div className="space-y-3 text-xs text-dusk/70">
          <div className="grid grid-cols-[2fr_0.9fr_0.9fr_1fr] gap-3 border-b border-ink/10 pb-2 text-[11px] uppercase tracking-[0.16em]">
            <span>Address</span>
            <span>Type</span>
            <span>Size</span>
            <span>Status</span>
          </div>
          {rows.map((row) => {
            const isActive = row.status === 'Photos Needed';
            return (
              <button
                key={row.id}
                className={`grid w-full grid-cols-[2fr_0.9fr_0.9fr_1fr] gap-3 border-b border-ink/5 py-3 text-left ${
                  isActive ? 'font-semibold text-ink' : 'text-dusk/70'
                }`}
                onClick={() => {
                  if (!isActive) return;
                  setActiveProjectId(row.id);
                  setScreen('details');
                }}
              >
                <span>{row.address}</span>
                <span>{row.type}</span>
                <span>{row.size}</span>
                <span>
                  <span
                    className={`${statusChipBase} ${statusChipClasses(row.status)}`}
                  >
                    {row.status}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProjectDetails = () => (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Project Details</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl">{project.address}</h1>
          <span className={`${statusChipBase} ${statusChipClasses(project.status)}`}>
            {project.status}
          </span>
        </div>
        <div className="grid gap-2 text-sm text-dusk/70">
          <div>Customer: Lopez Family</div>
          <div>Address: {project.address}</div>
          <div>System type: {project.type}</div>
          <div>System size: 6.4 kW DC / 5.2 kW AC</div>
          <div>Jurisdiction: Agoura Hills (CA)</div>
        </div>
      </header>

      <section className="space-y-3 border-t border-ink/10 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Equipment List</p>
        <div className="grid gap-2 text-sm text-dusk/80">
          {equipmentList.map((item) => (
            <div key={item.name} className="grid grid-cols-[60px_1fr] gap-3">
              <span>({item.count})</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 pt-6">
        <button
          className="w-full rounded-full bg-sun px-6 py-3 text-sm font-semibold text-white"
          onClick={() => setScreen('overview')}
        >
          View Capture Overview
        </button>
      </section>
    </div>
  );

  const renderCaptureOverview = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        {steps.map((step) => {
          const status = stepStatus(step);
          const isOpen = step.id === openOverviewStepId;
          const statusClasses = statusChipClasses(status);
          return (
            <div
              key={step.id}
              className={`rounded-2xl border border-ink/10 pb-4 ${
                isOpen ? 'bg-cloud/40 shadow-soft' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  className="flex flex-1 items-start justify-between px-4 pt-4 text-left"
                  onClick={() =>
                    setOpenOverviewStepId((current) => (current === step.id ? '' : step.id))
                  }
                >
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`${statusChipBase} ${statusClasses}`}>
                      {status}
                    </span>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                        isOpen ? 'border-ink/20 bg-white' : 'border-ink/10 bg-white'
                      } text-dusk/70`}
                    >
                      {isOpen ? (
                        <svg viewBox="0 0 20 20" className="h-4 w-4">
                          <path
                            d="M5 12l5-5 5 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 20 20" className="h-4 w-4">
                          <path
                            d="M5 8l5 5 5-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                </button>
              </div>
              {isOpen ? (
                <div className="mt-3 px-4 text-xs text-dusk/70">
                  {step.substeps.map((substep) => {
                    const count = capturesBySubstep[substep.id]?.length ?? 0;
                    const actionLabel =
                      count >= substep.requiredMin ? 'Edit' : count > 0 ? 'Continue' : 'Start';
                    const fallbackImage = sampleMediaBySubstep[substep.id]?.[0];
                    return (
                    <div key={substep.id} className="space-y-2 border-t border-ink/5 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink">{substep.title}</span>
                      </div>
                      <p className="text-xs text-dusk/60">
                        Required: {substep.requiredMin} {substep.media.toLowerCase()}
                        {substep.requiredMin === 1 ? '' : 's'}
                      </p>
                      <p className="text-xs text-dusk/70">{substep.capture}</p>
                      <div className="grid grid-cols-4 gap-2">
                          {Array.from(
                            { length: Math.max(substep.requiredMin, count, 1) },
                            (_, index) => {
                              const isCaptured = index < count;
                              const capture = capturesBySubstep[substep.id]?.[index];
                              const imageUrl = capture?.imageUrl ?? fallbackImage;
                              return (
                                <div
                                  key={`${substep.id}-${index}`}
                                  className={`relative flex h-20 items-center justify-center rounded-lg border ${
                                    isCaptured
                                      ? 'border-ink/10 bg-cloud/60'
                                      : 'border-dashed border-ink/30 bg-white'
                                  }`}
                                >
                              {isCaptured && imageUrl ? (
                                <div
                                  className="h-full w-full rounded-lg bg-cover bg-center"
                                  style={{ backgroundImage: `url(${imageUrl})` }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  {substep.media === 'Video' ? (
                                    <span className="block h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-dusk/70" />
                                  ) : (
                                    <span className="flex h-7 w-10 items-center justify-center rounded-md border border-dusk/50">
                                      <span className="h-2 w-2 rounded-full bg-dusk/50" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                      </div>
                      <button
                        className="w-full rounded-full bg-sun px-4 py-2 text-[11px] font-semibold text-white"
                        onClick={() => openSubstep(substep.id)}
                      >
                        {actionLabel}
                      </button>
                    </div>
                  );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStepOverview = () => (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Step Overview</p>
        <h1 className="font-display text-3xl">{activeStep.title}</h1>
      </header>

      <div className="space-y-4">
        {activeStep.substeps.map((substep, index) => {
          const count = capturesBySubstep[substep.id]?.length ?? 0;
          const status = statusLabel(count, substep.requiredMin);
          return (
            <div key={substep.id} className="border-b border-ink/10 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    {index + 1}. {substep.title}
                  </p>
                  <p className="text-xs text-dusk/70">{substep.summary}</p>
                </div>
                <span className={`${statusChipBase} ${statusChipClasses(status)}`}>
                  {status}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs text-dusk/70">
                <p>{substep.capture}</p>
                <div className="text-xs">
                  <p className="font-semibold text-dusk">Acceptance criteria</p>
                  <ul className="mt-1 space-y-1">
                    {substep.acceptance.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3">
                <button
                  className="w-full rounded-full bg-sun px-4 py-2 text-xs font-semibold text-white"
                  onClick={() => openSubstep(substep.id)}
                >
                  {count === 0 ? 'Start capture' : 'Continue capture'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTaskHub = () => (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Capture Task</p>
        <h1 className="font-display text-3xl">{activeSubstep.title}</h1>
        <p className="text-sm text-dusk/70">{activeSubstep.capture}</p>
      </header>

      <section className="space-y-2 border-t border-ink/10 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Captured</p>
        <div className="grid grid-cols-2 gap-3">
          {Array.from(
            { length: Math.max(activeSubstep.requiredMin, activeCount, 1) },
            (_, index) => {
              const isCaptured = index < activeCount;
              const capture = capturesBySubstep[activeSubstep.id]?.[index];
              const imageUrl = capture?.imageUrl;
              const tileClasses = `relative h-24 overflow-hidden rounded-xl border ${
                isCaptured ? 'border-ink/10 bg-cloud/60' : 'border-dashed border-ink/30 bg-white'
              }`;
              const tileContent = isCaptured && imageUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {activeSubstep.media === 'Video' ? (
                    <span className="block h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-dusk/70" />
                  ) : (
                    <span className="flex h-7 w-10 items-center justify-center rounded-md border border-dusk/50">
                      <span className="h-2 w-2 rounded-full bg-dusk/50" />
                    </span>
                  )}
                </div>
              );

              return isCaptured ? (
                <div key={`${activeSubstep.id}-${index}`} className={tileClasses}>
                  {tileContent}
                </div>
              ) : (
                <button
                  key={`${activeSubstep.id}-${index}`}
                  className={`${tileClasses} cursor-pointer transition hover:border-ink/50`}
                  onClick={() => setScreen('camera')}
                >
                  {tileContent}
                </button>
              );
            }
          )}
        </div>
      </section>

      {activeSubstep.id === 'penetrations' ? (
        <section className="space-y-3 border-t border-ink/10 pt-6 text-sm text-dusk/70">
          <p className="text-xs uppercase tracking-[0.2em] text-dusk/60">Photo tips</p>
          <div className="grid gap-2">
            <div>Well lit, no harsh shadows.</div>
            <div>Show context and close detail in separate photos.</div>
            <div>Keep flashing fully visible and centered.</div>
            <div>Roof material around penetration visible (tile or shingle).</div>
            <div>Labels or markings must be legible.</div>
            <div>No blur; edges sharp.</div>
          </div>
        </section>
      ) : null}

      <section className="space-y-3 border-t border-ink/10 pt-6">
        <button
          className="w-full rounded-full bg-sun px-6 py-3 text-sm font-semibold text-white"
          onClick={() => setScreen('camera')}
        >
          Add {activeSubstep.media.toLowerCase()}
        </button>
        <button
          className="w-full rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (nextIncompleteSubstep) {
              setActiveSubstepId(nextIncompleteSubstep.id);
              setScreen('task');
            } else {
              setOpenOverviewStepId(activeStep.id);
              setScreen('overview');
            }
          }}
          disabled={!doneEnabled}
        >
          {nextIncompleteSubstep ? `Next: ${nextIncompleteSubstep.title}` : 'Done'}
        </button>
      </section>
    </div>
  );

  const renderCamera = () => (
    <div className="flex min-h-screen flex-col justify-between bg-black px-6 py-6 text-white">
      <div className="flex items-center justify-between text-xs">
        <button className="font-semibold" onClick={() => setScreen('task')}>
          Cancel
        </button>
        <span>{activeSubstep.title}</span>
        <span>{activeSubstep.media}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {nextSampleImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${nextSampleImage})` }}
          />
        ) : null}
        <div className="relative text-xs text-white/70">Camera preview</div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          className="h-16 w-16 rounded-full border-4 border-white"
          onClick={handleShutter}
        />
        <span className="text-xs text-white/60">Tap to capture</span>
      </div>
    </div>
  );

  const renderValidation = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      {validationState === 'checking' ? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-sm">Checking {activeSubstep.media.toLowerCase()} quality...</p>
        </div>
      ) : validationState === 'accepted' ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-fern text-fern">
            OK
          </div>
          <p className="text-sm">Capture accepted</p>
          <p className="text-xs text-white/60">Returning to task...</p>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-sm text-rose-300">Image is blurry - steady the camera or move closer</p>
          <button
            className="w-full rounded-full bg-sun px-6 py-3 text-sm font-semibold text-white"
            onClick={() => setScreen('camera')}
          >
            Retake {activeSubstep.media.toLowerCase()}
          </button>
          <button
            className="w-full rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white"
            onClick={() => setScreen('task')}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main className={isCameraMode ? 'bg-black text-white' : 'bg-white text-ink'}>
      {!isCameraMode ? (
        <>
          <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/70">SolarAPP+</p>
              <p className="font-display text-lg">Installer Capture</p>
            </div>
            <div className="rounded-full border border-ink/10 px-3 py-1 text-xs text-dusk">
              Miguel R.
            </div>
          </header>

          <section className="px-6 py-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-dusk/60">
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {item.onClick && !isLast ? (
                      <button
                        className="font-semibold text-ink/70 hover:text-ink"
                        onClick={item.onClick}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className={isLast ? 'font-semibold text-ink' : ''}>{item.label}</span>
                    )}
                    {!isLast ? <span className="text-dusk/40">/</span> : null}
                  </span>
                );
              })}
            </div>
          </section>

          <section className="px-6 pb-8">
            {screen === 'projects' && renderProjects()}
            {screen === 'details' && renderProjectDetails()}
            {screen === 'overview' && renderCaptureOverview()}
            {screen === 'step' && renderStepOverview()}
            {screen === 'task' && renderTaskHub()}
          </section>
        </>
      ) : null}

      {screen === 'camera' && renderCamera()}
      {screen === 'validation' && renderValidation()}
    </main>
  );
}

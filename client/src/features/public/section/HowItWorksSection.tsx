// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import {
//   Link2,
//   Zap,
//   Radio,
//   RefreshCw,
//   Globe,
//   Copy,
//   Sparkles,
// } from "lucide-react";

// const STEP_INTERVAL = 4200;

// const steps = [
//   {
//     icon: Link2,
//     title: "Get an endpoint",
//     description: "A unique URL generated instantly",
//   },
//   {
//     icon: Zap,
//     title: "A webhook fires",
//     description: "Stripe, GitHub or any service sends a request",
//   },
//   {
//     icon: Radio,
//     title: "Watch it live",
//     description: "Dashboard updates over sockets, no refresh",
//   },
//   {
//     icon: RefreshCw,
//     title: "Replay and debug",
//     description: "Resend to any target, AI explains the payload",
//   },
// ] as const;

// export default function HowItWorks() {
//   const [step, setStep] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [reducedMotion, setReducedMotion] = useState(false);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // Connector line / dot are positioned from the *actual* rendered circle
//   // centers, not a hardcoded pixel scale — keeps them pixel-accurate at any
//   // container width instead of relying on a fixed-viewBox SVG that only
//   // lines up correctly at one specific width.
//   const trackRef = useRef<HTMLDivElement>(null);
//   const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
//   const [centers, setCenters] = useState<number[] | null>(null);

//   useLayoutEffect(() => {
//     function measure() {
//       const track = trackRef.current;
//       if (!track) return;
//       const trackRect = track.getBoundingClientRect();
//       const next = nodeRefs.current.map((el) => {
//         if (!el) return 0;
//         const r = el.getBoundingClientRect();
//         return (
//           ((r.left + r.width / 2 - trackRect.left) / trackRect.width) * 100
//         );
//       });
//       setCenters(next);
//     }
//     measure();
//     const ro = new ResizeObserver(measure);
//     if (trackRef.current) ro.observe(trackRef.current);
//     window.addEventListener("resize", measure);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", measure);
//     };
//   }, []);

//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReducedMotion(mq.matches);
//     const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
//     mq.addEventListener("change", handler);
//     return () => mq.removeEventListener("change", handler);
//   }, []);

//   useEffect(() => {
//     if (reducedMotion || isPaused) return;
//     timerRef.current = setInterval(() => {
//       setStep((s) => (s + 1) % steps.length);
//     }, STEP_INTERVAL);
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [reducedMotion, isPaused, step]);

//   function selectStep(i: number) {
//     setStep(i);
//   }

//   return (
//     <div className="mx-auto max-w-3xl py-12 md:py-16">
//       {/* Step nodes */}
//       <div ref={trackRef} className="relative px-5 pb-12">
//         {centers && (
//           <>
//             <div
//               className="absolute top-9 h-[1.5px] bg-border-default"
//               style={{
//                 left: `${centers[0]}%`,
//                 right: `${100 - centers[centers.length - 1]}%`,
//               }}
//               aria-hidden="true"
//             />
//             <div
//               className="absolute top-9 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-[left] duration-500 ease-in-out"
//               style={{ left: `${centers[step]}%` }}
//               aria-hidden="true"
//             />
//           </>
//         )}

//         <div className="relative grid grid-cols-4 gap-5">
//           {steps.map(({ icon: Icon, title, description }, i) => {
//             const active = i === step;
//             return (
//               <button
//                 key={title}
//                 type="button"
//                 ref={(el) => {
//                   nodeRefs.current[i] = el;
//                 }}
//                 onClick={() => selectStep(i)}
//                 onMouseEnter={() => setIsPaused(true)}
//                 onMouseLeave={() => setIsPaused(false)}
//                 onFocus={() => setIsPaused(true)}
//                 onBlur={() => setIsPaused(false)}
//                 className="z-10 flex cursor-pointer flex-col items-center gap-4 text-center"
//                 aria-pressed={active}
//                 aria-label={`Step ${i + 1}: ${title}`}
//               >
//                 <div
//                   className={[
//                     "flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 transition-all duration-300",
//                     active
//                       ? "scale-[1.08] border-accent bg-accent/10"
//                       : "scale-100 border-border-default bg-bg-sidebar",
//                   ].join(" ")}
//                 >
//                   <Icon
//                     size={28}
//                     strokeWidth={1.75}
//                     className={active ? "text-accent" : "text-text-secondary"}
//                   />
//                 </div>
//                 <div>
//                   <p className="m-0 mb-1.5 text-base font-medium text-text-primary">
//                     {title}
//                   </p>
//                   <p className="m-0 text-[13px] leading-relaxed text-text-secondary">
//                     {description}
//                   </p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Preview panel */}
//       <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-border-default bg-bg-card p-8">
//         {step === 0 && (
//           <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 text-center">
//             <p className="m-0 text-[13px] uppercase tracking-wide text-text-secondary">
//               Your endpoint
//             </p>
//             <div className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-sidebar px-6 py-4">
//               <Globe size={20} className="text-accent" aria-hidden="true" />
//               <span className="font-mono text-[17px] text-text-primary">
//                 api.hooklens.app/h/abc123xyz
//               </span>
//               <Copy size={18} className="text-text-muted" aria-hidden="true" />
//             </div>
//             <div className="flex items-center gap-2 text-[13px] text-text-secondary">
//               <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
//               Waiting for requests
//             </div>
//           </div>
//         )}

//         {step === 1 && (
//           <div className="flex min-h-[280px] flex-col justify-center gap-3.5">
//             <div className="flex items-center gap-2.5">
//               <span className="rounded-md bg-success-bg px-2.5 py-0.5 font-mono text-xs font-medium text-success">
//                 POST
//               </span>
//               <span className="font-mono text-sm text-text-secondary">
//                 /h/abc123xyz
//               </span>
//               <span className="ml-auto text-xs text-text-muted">
//                 from Stripe
//               </span>
//             </div>
//             <div className="rounded-[10px] border border-border-default bg-bg-sidebar p-4 font-mono text-[13px] leading-[1.7] text-text-secondary">
//               <div>content-type: application/json</div>
//               <div>x-stripe-signature: t=1737...</div>
//               <div className="mt-2.5 text-text-primary">{"{"}</div>
//               <div className="pl-4 text-text-primary">
//                 "type": "payment_intent.succeeded",
//               </div>
//               <div className="pl-4 text-text-primary">"amount": 4900,</div>
//               <div className="pl-4 text-text-primary">"currency": "usd"</div>
//               <div className="text-text-primary">{"}"}</div>
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="flex min-h-[280px] flex-col justify-center gap-2.5">
//             <div className="mb-1.5 flex items-center gap-2">
//               <span className="inline-block h-2 w-2 rounded-full bg-success" />
//               <span className="text-[13px] text-text-secondary">
//                 Live · InspectPage
//               </span>
//             </div>

//             <div className="flex items-center gap-3 rounded-[10px] border border-accent bg-bg-sidebar px-4 py-3">
//               <span className="rounded-md bg-success-bg px-2 py-0.5 font-mono text-[11px] font-medium text-success">
//                 POST
//               </span>
//               <span className="font-mono text-[13px] text-text-primary">
//                 payment_intent.succeeded
//               </span>
//               <span className="ml-auto text-xs text-text-muted">just now</span>
//             </div>

//             <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-70">
//               <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[11px] font-medium text-accent">
//                 GET
//               </span>
//               <span className="font-mono text-[13px] text-text-primary">
//                 customer.retrieve
//               </span>
//               <span className="ml-auto text-xs text-text-muted">4m ago</span>
//             </div>

//             <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-45">
//               <span className="rounded-md bg-success-bg px-2 py-0.5 font-mono text-[11px] font-medium text-success">
//                 POST
//               </span>
//               <span className="font-mono text-[13px] text-text-primary">
//                 charge.updated
//               </span>
//               <span className="ml-auto text-xs text-text-muted">11m ago</span>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="flex min-h-[280px] flex-col justify-center gap-4">
//             <div className="flex gap-4">
//               <div className="flex-1 rounded-[10px] border border-border-default bg-bg-sidebar p-3.5">
//                 <p className="m-0 mb-2 text-xs text-text-muted">Replayed to</p>
//                 <p className="m-0 font-mono text-[13px] text-text-primary">
//                   localhost:3000/webhook
//                 </p>
//               </div>
//               <div className="flex-1 rounded-[10px] border border-border-default bg-bg-sidebar p-3.5">
//                 <p className="m-0 mb-2 text-xs text-text-muted">Response</p>
//                 <p className="m-0 font-mono text-[13px] text-success">
//                   200 OK · 84ms
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3 rounded-[10px] bg-accent/10 p-4">
//               <Sparkles
//                 size={18}
//                 className="mt-0.5 shrink-0 text-accent"
//                 aria-hidden="true"
//               />
//               <p className="m-0 text-[13px] leading-relaxed text-accent">
//                 This is a Stripe payment confirmation. A customer's payment of
//                 $49.00 succeeded, so your endpoint should mark the order as
//                 paid.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import {
  Link2,
  Zap,
  Radio,
  RefreshCw,
  Globe,
  Copy,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Get an endpoint",
    description: "A unique URL generated instantly",
  },
  {
    icon: Zap,
    title: "A webhook fires",
    description: "Stripe, GitHub or any service sends a request",
  },
  {
    icon: Radio,
    title: "Watch it live",
    description: "Dashboard updates over sockets, no refresh",
  },
  {
    icon: RefreshCw,
    title: "Replay and debug",
    description: "Resend to any target, AI explains the payload",
  },
] as const;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0);

  // Whichever card is crossing the vertical center of the viewport becomes
  // the active step — driven entirely by scroll position, no timers.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setProgress(active / (steps.length - 1));
  }, [active]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[300px_1px_1fr] md:gap-0">
        {/* Left column — heading/subheading stay put while the right side scrolls */}
        <div className="md:sticky md:top-20 md:h-fit md:self-start md:pr-10">
          <p className="m-0 mb-3 text-[13px] font-medium uppercase tracking-wider text-accent">
            How it works
          </p>
          <h2 className="m-0 mb-4 text-[32px] font-semibold leading-tight text-text-primary md:text-[36px]">
            From request to
            <br />
            resolved, in four steps
          </h2>
          <p className="m-0 max-w-[280px] text-[15px] leading-relaxed text-text-secondary">
            Every webhook that hits Hooklens moves through the same pipeline —
            watch it happen as you scroll.
          </p>

          {/* Step list synced to the active card on the right */}
          <div className="mt-10 flex flex-col">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() =>
                  cardRefs.current[i]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                className="flex items-center gap-3 py-2 text-left"
              >
                <span
                  className={[
                    "font-mono text-xs transition-colors duration-300",
                    i === active ? "text-accent" : "text-text-muted",
                  ].join(" ")}
                >
                  0{i + 1}
                </span>
                <span
                  className={[
                    "text-sm transition-colors duration-300",
                    i === active
                      ? "font-medium text-text-primary"
                      : "text-text-muted",
                  ].join(" ")}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress rail between the two columns */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-default" />
          <div
            className="absolute left-1/2 w-px -translate-x-1/2 bg-accent transition-all duration-500 ease-out"
            style={{ top: 0, height: `${progress * 100}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Right column — the 4 cards, scrolling past the fixed heading */}
        <div className="flex flex-col gap-14 md:pl-10">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={[
                "rounded-2xl border bg-bg-card p-7 transition-all duration-300",
                i === active
                  ? "border-accent shadow-sm"
                  : "border-border-default opacity-55",
              ].join(" ")}
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    i === active
                      ? "border-accent bg-accent/10"
                      : "border-border-default bg-bg-sidebar",
                  ].join(" ")}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className={
                      i === active ? "text-accent" : "text-text-secondary"
                    }
                  />
                </div>
                <div>
                  <p className="m-0 text-[15px] font-medium text-text-primary">
                    {title}
                  </p>
                  <p className="m-0 text-[13px] text-text-secondary">
                    {description}
                  </p>
                </div>
              </div>

              {i === 0 && (
                <div className="flex flex-col items-center gap-5 rounded-xl border border-border-default bg-bg-sidebar/40 py-10 text-center">
                  <p className="m-0 text-[13px] uppercase tracking-wide text-text-secondary">
                    Your endpoint
                  </p>
                  <div className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-sidebar px-6 py-4">
                    <Globe
                      size={20}
                      className="text-accent"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[16px] text-text-primary">
                      api.hooklens.app/h/abc123xyz
                    </span>
                    <Copy
                      size={18}
                      className="text-text-muted"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
                    Waiting for requests
                  </div>
                </div>
              )}

              {i === 1 && (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-md bg-success-bg px-2.5 py-0.5 font-mono text-xs font-medium text-success">
                      POST
                    </span>
                    <span className="font-mono text-sm text-text-secondary">
                      /h/abc123xyz
                    </span>
                    <span className="ml-auto text-xs text-text-muted">
                      from Stripe
                    </span>
                  </div>
                  <div className="rounded-[10px] border border-border-default bg-bg-sidebar p-4 font-mono text-[13px] leading-[1.7] text-text-secondary">
                    <div>content-type: application/json</div>
                    <div>x-stripe-signature: t=1737...</div>
                    <div className="mt-2.5 text-text-primary">{"{"}</div>
                    <div className="pl-4 text-text-primary">
                      "type": "payment_intent.succeeded",
                    </div>
                    <div className="pl-4 text-text-primary">
                      "amount": 4900,
                    </div>
                    <div className="pl-4 text-text-primary">
                      "currency": "usd"
                    </div>
                    <div className="text-text-primary">{"}"}</div>
                  </div>
                </div>
              )}

              {i === 2 && (
                <div className="flex flex-col gap-2.5">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-success" />
                    <span className="text-[13px] text-text-secondary">
                      Live · InspectPage
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-[10px] border border-accent bg-bg-sidebar px-4 py-3">
                    <span className="rounded-md bg-success-bg px-2 py-0.5 font-mono text-[11px] font-medium text-success">
                      POST
                    </span>
                    <span className="font-mono text-[13px] text-text-primary">
                      payment_intent.succeeded
                    </span>
                    <span className="ml-auto text-xs text-text-muted">
                      just now
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-70">
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[11px] font-medium text-accent">
                      GET
                    </span>
                    <span className="font-mono text-[13px] text-text-primary">
                      customer.retrieve
                    </span>
                    <span className="ml-auto text-xs text-text-muted">
                      4m ago
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-45">
                    <span className="rounded-md bg-success-bg px-2 py-0.5 font-mono text-[11px] font-medium text-success">
                      POST
                    </span>
                    <span className="font-mono text-[13px] text-text-primary">
                      charge.updated
                    </span>
                    <span className="ml-auto text-xs text-text-muted">
                      11m ago
                    </span>
                  </div>
                </div>
              )}

              {i === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 rounded-[10px] border border-border-default bg-bg-sidebar p-3.5">
                      <p className="m-0 mb-2 text-xs text-text-muted">
                        Replayed to
                      </p>
                      <p className="m-0 font-mono text-[13px] text-text-primary">
                        localhost:3000/webhook
                      </p>
                    </div>
                    <div className="flex-1 rounded-[10px] border border-border-default bg-bg-sidebar p-3.5">
                      <p className="m-0 mb-2 text-xs text-text-muted">
                        Response
                      </p>
                      <p className="m-0 font-mono text-[13px] text-success">
                        200 OK · 84ms
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-[10px] bg-accent/10 p-4">
                    <Sparkles
                      size={18}
                      className="mt-0.5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <p className="m-0 text-[13px] leading-relaxed text-accent">
                      This is a Stripe payment confirmation. A customer's
                      payment of $49.00 succeeded, so your endpoint should mark
                      the order as paid.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

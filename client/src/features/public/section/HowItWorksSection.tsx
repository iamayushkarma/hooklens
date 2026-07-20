import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Link2,
  Zap,
  Radio,
  RefreshCw,
  Globe,
  Copy,
  Sparkles,
} from "lucide-react";

const STEP_INTERVAL = 4200;

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
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Connector line / dot are positioned from the *actual* rendered circle
  // centers, not a hardcoded pixel scale — keeps them pixel-accurate at any
  // container width instead of relying on a fixed-viewBox SVG that only
  // lines up correctly at one specific width.
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [centers, setCenters] = useState<number[] | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const next = nodeRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return (
          ((r.left + r.width / 2 - trackRect.left) / trackRect.width) * 100
        );
      });
      setCenters(next);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused) return;
    timerRef.current = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, STEP_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reducedMotion, isPaused, step]);

  function selectStep(i: number) {
    setStep(i);
  }

  return (
    <div className="mx-auto max-w-3xl py-12 md:py-16">
      {/* Step nodes */}
      <div ref={trackRef} className="relative px-5 pb-12">
        {centers && (
          <>
            <div
              className="absolute top-9 h-[1.5px] bg-border-default"
              style={{
                left: `${centers[0]}%`,
                right: `${100 - centers[centers.length - 1]}%`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute top-9 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-[left] duration-500 ease-in-out"
              style={{ left: `${centers[step]}%` }}
              aria-hidden="true"
            />
          </>
        )}

        <div className="relative grid grid-cols-4 gap-5">
          {steps.map(({ icon: Icon, title, description }, i) => {
            const active = i === step;
            return (
              <button
                key={title}
                type="button"
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                onClick={() => selectStep(i)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="z-10 flex cursor-pointer flex-col items-center gap-4 text-center"
                aria-pressed={active}
                aria-label={`Step ${i + 1}: ${title}`}
              >
                <div
                  className={[
                    "flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 transition-all duration-300",
                    active
                      ? "scale-[1.08] border-accent bg-accent/10"
                      : "scale-100 border-border-default bg-bg-sidebar",
                  ].join(" ")}
                >
                  <Icon
                    size={28}
                    strokeWidth={1.75}
                    className={active ? "text-accent" : "text-text-secondary"}
                  />
                </div>
                <div>
                  <p className="m-0 mb-1.5 text-base font-medium text-text-primary">
                    {title}
                  </p>
                  <p className="m-0 text-[13px] leading-relaxed text-text-secondary">
                    {description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview panel */}
      <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-border-default bg-bg-card p-8">
        {step === 0 && (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 text-center">
            <p className="m-0 text-[13px] uppercase tracking-wide text-text-secondary">
              Your endpoint
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-sidebar px-6 py-4">
              <Globe size={20} className="text-accent" aria-hidden="true" />
              <span className="font-mono text-[17px] text-text-primary">
                api.hooklens.app/h/abc123xyz
              </span>
              <Copy size={18} className="text-text-muted" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              Waiting for requests
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex min-h-[280px] flex-col justify-center gap-3.5">
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
              <div className="pl-4 text-text-primary">"amount": 4900,</div>
              <div className="pl-4 text-text-primary">"currency": "usd"</div>
              <div className="text-text-primary">{"}"}</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex min-h-[280px] flex-col justify-center gap-2.5">
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
              <span className="ml-auto text-xs text-text-muted">just now</span>
            </div>

            <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-70">
              <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[11px] font-medium text-accent">
                GET
              </span>
              <span className="font-mono text-[13px] text-text-primary">
                customer.retrieve
              </span>
              <span className="ml-auto text-xs text-text-muted">4m ago</span>
            </div>

            <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-45">
              <span className="rounded-md bg-success-bg px-2 py-0.5 font-mono text-[11px] font-medium text-success">
                POST
              </span>
              <span className="font-mono text-[13px] text-text-primary">
                charge.updated
              </span>
              <span className="ml-auto text-xs text-text-muted">11m ago</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex min-h-[280px] flex-col justify-center gap-4">
            <div className="flex gap-4">
              <div className="flex-1 rounded-[10px] border border-border-default bg-bg-sidebar p-3.5">
                <p className="m-0 mb-2 text-xs text-text-muted">Replayed to</p>
                <p className="m-0 font-mono text-[13px] text-text-primary">
                  localhost:3000/webhook
                </p>
              </div>
              <div className="flex-1 rounded-[10px] border border-border-default bg-bg-sidebar p-3.5">
                <p className="m-0 mb-2 text-xs text-text-muted">Response</p>
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
                This is a Stripe payment confirmation. A customer's payment of
                $49.00 succeeded, so your endpoint should mark the order as
                paid.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

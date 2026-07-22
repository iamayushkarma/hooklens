import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  Link2,
  Zap,
  Radio,
  RefreshCw,
  Globe,
  Copy,
  Sparkles,
} from "lucide-react";

const methodStyles = {
  get: { text: "text-get-text", bg: "bg-get-bg" },
  post: { text: "text-post-text", bg: "bg-post-bg" },
  patch: { text: "text-patch-text", bg: "bg-patch-bg" },
  put: { text: "text-put-text", bg: "bg-put-bg" },
};

type Method = keyof typeof methodStyles;

interface Step {
  method: Method;
  label: string;
  icon: typeof Link2;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    method: "get",
    label: "GET",
    icon: Link2,
    title: "Spin up an endpoint",
    description: "A nanoid-generated URL, live the moment it's created",
  },
  {
    method: "post",
    label: "POST",
    icon: Zap,
    title: "Any request gets captured",
    description:
      "Headers, raw body, query params — every method, no auth needed",
  },
  {
    method: "patch",
    label: "LIVE",
    icon: Radio,
    title: "Dashboard updates instantly",
    description:
      "Socket.io pushes it straight to your inspect page, zero refresh",
  },
  {
    method: "put",
    label: "REPLAY",
    icon: RefreshCw,
    title: "Replay and let AI explain it",
    description:
      "Re-send to any target and get a plain-English breakdown from Groq",
  },
];

interface StepCardProps {
  index: number;
  step: (typeof steps)[number];
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}
function StepNumberBadge({
  number,
  bgClass,
  rotate,
}: {
  number: number;
  bgClass: string;
  rotate: number;
}) {
  return (
    <div
      className={`absolute -top-4 -left-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${bgClass}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[15px] font-bold text-text-primary shadow-sm">
        {number}
      </div>
    </div>
  );
}

function StepCard({
  index,
  step,
  progress,
  range,
  targetScale,
}: StepCardProps) {
  const scale = useTransform(progress, range, [1, targetScale]);

  // Alternate tilt direction by index: even cards lean left, odd cards lean right.
  // Each card starts slightly rotated and settles toward flat as it gets pushed back in the stack.
  const startRotate = index % 2 === 0 ? -3 : 3;
  const endRotate = index % 2 === 0 ? -1 : 1;
  const rotate = useTransform(progress, range, [startRotate, endRotate]);

  const Icon = step.icon;
  const colors = methodStyles[step.method];
  const badgeRotate = index % 2 === 0 ? -6 : 6;

  return (
    <div className="h-screen flex items-center justify-center sticky top-0">
      <motion.div
        style={{
          scale,
          rotate,
          top: `calc(-5vh + ${index * 25}px)`,
        }}
        className="relative -top-[10%] w-full max-w-2xl origin-top rounded-2xl border border-border-default bg-bg-card p-7 shadow-lg"
      >
        <StepNumberBadge
          number={index + 1}
          bgClass={colors.bg}
          rotate={badgeRotate}
        />

        <div className="mb-6 flex items-center gap-3.5">
          <div
            className={[
              "flex h-11 w-11 items-center justify-center rounded-full border-2 shrink-0",
              `border-transparent ${colors.bg} ${colors.text}`,
            ].join(" ")}
          >
            <Icon size={20} strokeWidth={1.75} />
          </div>

          <span
            className={[
              "rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide",
              colors.bg,
              colors.text,
            ].join(" ")}
          >
            {step.label}
          </span>

          <div>
            <p className="m-0 text-[15px] font-medium text-text-primary">
              {step.title}
            </p>
            <p className="m-0 text-[13px] text-text-secondary">
              {step.description}
            </p>
          </div>
        </div>

        {index === 0 && (
          <div className="flex flex-col items-center gap-5 rounded-xl border border-border-default bg-bg-sidebar/40 py-10 text-center">
            <p className="m-0 text-[13px] uppercase tracking-wide text-text-secondary">
              Your endpoint
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-sidebar px-6 py-4">
              <Globe size={20} className="text-get-text" aria-hidden="true" />
              <span className="font-mono text-[16px] text-text-primary">
                api.hooklens.app/h/abc123xyz
              </span>
              <Copy size={18} className="text-text-muted" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-get-text" />
              Public route · no auth · waiting for requests
            </div>
          </div>
        )}

        {index === 1 && (
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <span className="rounded-md bg-post-bg px-2.5 py-0.5 font-mono text-xs font-medium text-post-text">
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
            <p className="m-0 text-xs text-text-muted">
              Stored with headers, IP, and content type — TTL-expires in 7 days
            </p>
          </div>
        )}

        {index === 2 && (
          <div className="flex flex-col gap-2.5">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-patch-text" />
              <span className="text-[13px] text-text-secondary">
                Live · InspectPage
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-[10px] border border-patch-border bg-bg-sidebar px-4 py-3">
              <span className="rounded-md bg-post-bg px-2 py-0.5 font-mono text-[11px] font-medium text-post-text">
                POST
              </span>
              <span className="font-mono text-[13px] text-text-primary">
                payment_intent.succeeded
              </span>
              <span className="ml-auto text-xs text-text-muted">just now</span>
            </div>
            <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-70">
              <span className="rounded-md bg-get-bg px-2 py-0.5 font-mono text-[11px] font-medium text-get-text">
                GET
              </span>
              <span className="font-mono text-[13px] text-text-primary">
                customer.retrieve
              </span>
              <span className="ml-auto text-xs text-text-muted">4m ago</span>
            </div>
            <div className="flex items-center gap-3 rounded-[10px] border border-border-default bg-bg-sidebar px-4 py-3 opacity-45">
              <span className="rounded-md bg-put-bg px-2 py-0.5 font-mono text-[11px] font-medium text-put-text">
                PUT
              </span>
              <span className="font-mono text-[13px] text-text-primary">
                charge.updated
              </span>
              <span className="ml-auto text-xs text-text-muted">11m ago</span>
            </div>
            <p className="m-0 text-xs text-text-muted">
              Pushed via a <code>request:new</code> event to the endpoint's
              Socket.io room
            </p>
          </div>
        )}

        {index === 3 && (
          <div className="flex flex-col gap-4">
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
            <p className="m-0 text-xs text-text-muted">
              Explained by Llama 3.3 70B via Groq — under 300 tokens, no raw
              JSON to parse
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24" ref={container}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
        {/* Left: sticky heading */}
        <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center">
          <p className="m-0 mb-3 text-[13px] font-medium uppercase tracking-wider text-accent">
            How it works
          </p>
          <h2 className="m-0 mb-4 text-[32px] font-semibold leading-tight text-text-primary md:text-[36px]">
            From request to resolved, in four steps
          </h2>
          <p className="max-w-[420px] text-[15px] leading-relaxed text-text-secondary">
            Every webhook that hits Hooklens moves through the same pipeline —
            watch it happen as you scroll.
          </p>
        </div>

        {/* Right: stacking cards */}
        <div>
          {steps.map((step, i) => {
            const targetScale = 1 - (steps.length - i) * 0.05;
            return (
              <StepCard
                key={step.title}
                index={i}
                step={step}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

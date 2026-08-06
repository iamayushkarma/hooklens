import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Link2,
  Radio,
  Repeat,
  Sparkles,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Step 1 — instant URL ---------- */
function VisualUrl({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <motion.div
        animate={{ y: active ? -2 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="rounded-lg border border-border-default bg-bg-card p-3 shadow-md"
      >
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-delete-text" />
          <span className="h-2 w-2 rounded-full bg-put-text" />
          <span className="h-2 w-2 rounded-full bg-patch-text" />
        </div>
        <p className="break-all font-mono text-[11px] leading-relaxed text-text-secondary">
          hooklens.com/
          <span className="rounded bg-post-bg px-1 font-semibold text-post-text">
            h/9f2ac1
          </span>
        </p>
      </motion.div>

      <div className="h-6">
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="inline-flex items-center gap-1.5 rounded-full bg-member-text px-2.5 py-1 shadow-sm"
            >
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
              <span className="text-[11px] font-semibold text-white">
                Copied
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Step 2 — live stream ---------- */
function VisualStream({ active }: { active: boolean }) {
  const rows = [
    {
      m: "POST",
      cls: "bg-post-text",
      p: "/checkout",
      s: "200",
      sc: "text-patch-text",
    },
    {
      m: "GET",
      cls: "bg-get-text",
      p: "/ping",
      s: "200",
      sc: "text-patch-text",
    },
    {
      m: "PUT",
      cls: "bg-put-text",
      p: "/user/12",
      s: "422",
      sc: "text-delete-text",
    },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.p}
          initial={false}
          animate={
            active ? { x: 0, opacity: 1 } : { x: i * 3, opacity: 1 - i * 0.1 }
          }
          transition={{
            duration: 0.35,
            ease: EASE,
            delay: active ? i * 0.06 : 0,
          }}
          className="flex items-center gap-2 rounded-md border border-border-subtle bg-bg-card px-2 py-1.5 shadow-sm"
        >
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide text-white ${r.cls}`}
          >
            {r.m}
          </span>
          <span className="flex-1 truncate font-mono text-[11px] text-text-primary">
            {r.p}
          </span>
          <span className={`font-mono text-[10px] font-bold ${r.sc}`}>
            {r.s}
          </span>
        </motion.div>
      ))}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-delete-text opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-delete-text" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
          live
        </span>
      </div>
    </div>
  );
}

/* ---------- Step 3 — replay ---------- */
function VisualReplay({ active }: { active: boolean }) {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <div className="min-w-0 flex-1 rounded-lg border border-border-default bg-bg-card p-2.5 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
          captured
        </p>
        <p className="mt-1 truncate font-mono text-[11px] text-text-primary">
          payload.json
        </p>
      </div>

      <motion.div
        animate={active ? { x: [0, 5, 0] } : { x: 0 }}
        transition={{
          duration: 0.7,
          ease: EASE,
          repeat: active ? Infinity : 0,
        }}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent shadow-md"
      >
        <ArrowRight className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
      </motion.div>

      <div className="min-w-0 flex-1 rounded-lg border border-member-border bg-gradient-to-br from-member-bg to-bg-card p-2.5 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-wider text-member-text/70">
          localhost
        </p>
        <p className="mt-1 font-mono text-[11px] font-bold text-member-text">
          200 · 84ms
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 4 — AI explainer ---------- */
function VisualExplain({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="rounded-lg border border-owner-border bg-bg-card p-3 shadow-md">
        <div className="mb-2 flex items-center gap-1.5">
          <motion.span
            animate={{ rotate: active ? [0, 12, -8, 0] : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-accent to-post-text"
          >
            <Sparkles className="h-3 w-3 text-white" strokeWidth={2.5} />
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            HookLens AI
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-text-primary">
          Stripe sent a{" "}
          <span className="rounded bg-post-bg px-1 font-mono font-semibold text-post-text">
            payment_intent.succeeded
          </span>{" "}
          for <span className="font-semibold text-member-text">₹1999.00</span> -
          the charge cleared.
        </p>
      </div>
    </div>
  );
}

const steps = [
  {
    n: "01",
    icon: Link2,
    title: "Grab a URL",
    body: "One click gives you a live endpoint. No signup, no config, no waiting.",
    badge: "bg-post-text",
    tint: "from-post-bg",
    ring: "group-hover:border-post-text/40",
    Visual: VisualUrl,
  },
  {
    n: "02",
    icon: Radio,
    title: "Watch it stream",
    body: "Every request lands in your dashboard the instant it arrives. Zero refresh.",
    badge: "bg-get-text",
    tint: "from-get-bg",
    ring: "group-hover:border-get-text/40",
    Visual: VisualStream,
  },
  {
    n: "03",
    icon: Repeat,
    title: "Replay anywhere",
    body: "Fire any captured request at a new target and diff status, headers and latency.",
    badge: "bg-patch-text",
    tint: "from-patch-bg",
    ring: "group-hover:border-patch-text/40",
    Visual: VisualReplay,
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Let AI decode it",
    body: "Plain-English breakdowns of any payload, so nobody squints at raw JSON again.",
    badge: "bg-accent",
    tint: "from-owner-bg",
    ring: "group-hover:border-accent/40",
    Visual: VisualExplain,
  },
];

function StepCard({ step }: { step: (typeof steps)[number] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? -4 : 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`group relative overflow-hidden rounded-xl border border-border-default bg-bg-card p-3 shadow-sm transition-[box-shadow,border-color] duration-300 hover:shadow-lg ${step.ring}`}
    >
      <div
        className={`relative h-[180px] overflow-hidden rounded-lg border border-border-subtle bg-gradient-to-br ${step.tint} via-bg-card to-bg-card p-4`}
      >
        <step.Visual active={hovered} />
      </div>

      <div className="px-1 pb-1 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`grid h-5 w-5 place-items-center rounded-md font-mono text-[10px] font-bold text-white ${step.badge}`}
          >
            {step.n}
          </span>
          <Icon className="h-4 w-4 text-text-secondary" strokeWidth={2} />
          <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
            {step.title}
          </h3>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          {step.body}
        </p>
      </div>
    </motion.article>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden bg-bg-base py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-post-bg via-get-bg to-patch-bg opacity-60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <span className="relative inline-flex items-center">
            <span className="absolute left-1.5 top-1.5 rounded-full border-2 border-dashed border-border-strong px-[18px] py-2 text-transparent" />
            <span className="relative inline-flex items-center gap-1.5 rounded-full border-2 border-text-primary bg-accent px-[18px] py-2 text-[11px] font-extrabold uppercase tracking-wide text-white">
              <Zap className="h-3 w-3" strokeWidth={3} />
              Four steps, sixty seconds
            </span>
          </span>

          <h2 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-5xl">
            How HookLens works
          </h2>

          <p className="mt-3 max-w-lg text-base leading-relaxed text-text-secondary">
            From a blank tab to a decoded webhook no tunnels, no CLI, no drama.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <StepCard key={s.n} step={s} />
          ))}
        </div>

        <div className="mt-12 bg-white flex flex-wrap items-center justify-between gap-6 rounded-lg border border-border-strong bg-card px-6 py-5">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Webhooks
            </span>
            <p className="text-base font-semibold text-text-primary">
              Ship webhooks without the guesswork.
            </p>
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-tooltip-bg px-3 py-1.5 font-mono text-[13px] text-tooltip-text">
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-success">
                POST
              </span>
              <span>
                https://hooklens.com/h/
                <span className="text-get-text">a1f9c2</span>
              </span>
            </div>
          </div>

          <Button>
            Get a URL <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

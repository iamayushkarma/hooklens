import {
  Link2,
  Radio,
  Repeat,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";

/* ---------- Step 1 — instant URL ---------- */
function VisualUrl() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="rotate-[-1.5deg] rounded-xl border-2 border-text-primary bg-bg-card p-3 shadow-[4px_4px_0_0_var(--color-post-text)]">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-delete-text" />
          <span className="h-2 w-2 rounded-full bg-put-text" />
          <span className="h-2 w-2 rounded-full bg-patch-text" />
        </div>
        <p className="break-all font-mono text-[11px] leading-relaxed text-text-secondary">
          hooklens.dev/<span className="text-post-text">e/9f2ac1</span>
        </p>
      </div>
      <div className="flex items-center gap-2 self-end rotate-[2deg] rounded-full border-2 border-text-primary bg-patch-bg px-3 py-1 shadow-[3px_3px_0_0_var(--color-text-primary)]">
        <Check className="h-3.5 w-3.5 text-patch-text" strokeWidth={3} />
        <span className="text-[11px] font-semibold text-text-primary">
          Copied
        </span>
      </div>
    </div>
  );
}

/* ---------- Step 2 — live stream ---------- */
function VisualStream() {
  const rows = [
    { m: "POST", cls: "bg-post-bg text-post-text", p: "/checkout", s: "200" },
    { m: "GET", cls: "bg-get-bg text-get-text", p: "/ping", s: "200" },
    { m: "PUT", cls: "bg-put-bg text-put-text", p: "/user/12", s: "422" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {rows.map((r, i) => (
        <div
          key={r.p}
          className="flex items-center gap-2 rounded-lg border-2 border-text-primary bg-bg-card px-2.5 py-2 shadow-[3px_3px_0_0_var(--color-text-primary)]"
          style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
        >
          <span
            className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${r.cls}`}
          >
            {r.m}
          </span>
          <span className="flex-1 truncate font-mono text-[11px] text-text-primary">
            {r.p}
          </span>
          <span className="font-mono text-[10px] font-bold text-patch-text">
            {r.s}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 self-start pt-1">
        <span className="h-2 w-2 animate-blink rounded-full bg-delete-text" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
          live
        </span>
      </div>
    </div>
  );
}

/* ---------- Step 3 — replay ---------- */
function VisualReplay() {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <div className="min-w-0 flex-1 rotate-[-2deg] rounded-xl border-2 border-text-primary bg-bg-card p-2.5 shadow-[3px_3px_0_0_var(--color-text-primary)]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          captured
        </p>
        <p className="mt-1 truncate font-mono text-[11px] text-text-primary">
          payload.json
        </p>
      </div>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-text-primary bg-admin-bg shadow-[2px_2px_0_0_var(--color-text-primary)]">
        <ArrowRight className="h-4 w-4 text-text-primary" strokeWidth={3} />
      </div>
      <div className="min-w-0 flex-1 rotate-[2deg] rounded-xl border-2 border-text-primary bg-bg-card p-2.5 shadow-[3px_3px_0_0_var(--color-patch-text)]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          localhost
        </p>
        <p className="mt-1 font-mono text-[11px] font-bold text-patch-text">
          200 · 84ms
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 4 — AI explainer ---------- */
function VisualExplain() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="rotate-[1.5deg] rounded-xl border-2 border-text-primary bg-bg-card p-3 shadow-[4px_4px_0_0_var(--color-owner-text)]">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-owner-text" strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            explainer
          </span>
        </div>
        <p className="text-[11px] leading-snug text-text-primary">
          Stripe sent a{" "}
          <span className="rounded bg-post-bg px-1 font-mono text-post-text">
            payment_intent.succeeded
          </span>{" "}
          for <span className="font-semibold">$49.00</span> — the charge
          cleared.
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
    tint: "bg-post-bg",
    pin: "bg-post-text",
    rotate: "-rotate-[1.2deg]",
    Visual: VisualUrl,
  },
  {
    n: "02",
    icon: Radio,
    title: "Watch it stream",
    body: "Every request lands in your dashboard the instant it arrives. Zero refresh.",
    tint: "bg-get-bg",
    pin: "bg-get-text",
    rotate: "rotate-[1deg]",
    Visual: VisualStream,
  },
  {
    n: "03",
    icon: Repeat,
    title: "Replay anywhere",
    body: "Fire any captured request at a new target and diff status, headers and latency.",
    tint: "bg-patch-bg",
    pin: "bg-patch-text",
    rotate: "-rotate-[1deg]",
    Visual: VisualReplay,
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Let AI decode it",
    body: "Plain-English breakdowns of any payload, so nobody squints at raw JSON again.",
    tint: "bg-owner-bg",
    pin: "bg-owner-text",
    rotate: "rotate-[1.4deg]",
    Visual: VisualExplain,
  },
];

function StepCard({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.icon;
  return (
    <article
      className={`group relative rounded-2xl border-2 border-text-primary bg-bg-card p-3 shadow-[6px_6px_0_0_var(--color-text-primary)] transition-transform duration-200 ${step.rotate} hover:rotate-0 hover:-translate-y-1`}
    >
      <span
        className={`absolute -top-2.5 left-6 h-5 w-5 rounded-full border-2 border-text-primary ${step.pin} shadow-[2px_2px_0_0_var(--color-text-primary)]`}
      />
      <div
        className={`h-[190px] rounded-xl border-2 border-text-primary ${step.tint} p-4`}
      >
        <step.Visual />
      </div>
      <div className="px-1 pb-1 pt-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md border-2 border-text-primary bg-bg-base px-1.5 font-mono text-[11px] font-bold text-text-primary">
            {step.n}
          </span>
          <Icon className="h-4 w-4 text-text-primary" strokeWidth={2.5} />
          <h3 className="text-[17px] font-bold tracking-tight text-text-primary">
            {step.title}
          </h3>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          {step.body}
        </p>
      </div>
    </article>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-bg-base py-20"
    >
      <div className="pointer-events-none absolute inset-0 paper-dots opacity-40" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mb-14 max-w-2xl">
          <span className="inline-flex -rotate-[1.5deg] items-center gap-2 rounded-full border-2 border-text-primary bg-admin-bg px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-text-primary shadow-[3px_3px_0_0_var(--color-text-primary)]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            Four steps, sixty seconds
          </span>
          <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-5xl">
            How HookLens{" "}
            <span className="relative inline-block">
              <span className="relative z-10">works</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-put-bg" />
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            From a blank tab to a decoded webhook — no tunnels, no CLI, no yak
            shaving.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((s) => (
            <StepCard key={s.n} step={s} />
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-text-primary bg-accent px-6 py-5 shadow-[6px_6px_0_0_var(--color-text-primary)]">
          <p className="text-base font-bold text-bg-card">
            Ship webhooks without the guesswork.
          </p>
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 rounded-full border-2 border-text-primary bg-bg-card px-4 py-2 text-sm font-bold text-text-primary shadow-[3px_3px_0_0_var(--color-text-primary)] transition-transform hover:-translate-y-0.5"
          >
            Get a URL
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </a>
        </div>
      </div>
    </section>
  );
}

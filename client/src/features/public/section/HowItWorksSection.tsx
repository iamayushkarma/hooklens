import { motion } from "framer-motion";
import { Link2, Webhook, Zap, Sparkles, type LucideIcon } from "lucide-react";

type Role = "danger" | "warning" | "success" | "owner";

const roleStyles: Record<Role, { icon: string; bg: string; border: string }> = {
  danger: {
    icon: "text-danger",
    bg: "bg-danger-bg",
    border: "border-danger-border",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning-bg",
    border: "border-warning-border",
  },
  success: {
    icon: "text-success",
    bg: "bg-success-bg",
    border: "border-success-border",
  },
  owner: {
    icon: "text-owner-text",
    bg: "bg-owner-bg",
    border: "border-owner-border",
  },
};

interface Step {
  role: Role;
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    role: "danger",
    icon: Link2,
    number: "01",
    title: "Spin up an endpoint",
    description: "One click generates a live URL. No signup friction.",
  },
  {
    role: "warning",
    icon: Webhook,
    number: "02",
    title: "Point any webhook at it",
    description: "Stripe, Razorpay, GitHub — anything that speaks HTTP.",
  },
  {
    role: "success",
    icon: Zap,
    number: "03",
    title: "Watch it land, live",
    description: "Headers, body, params — streamed the instant it arrives.",
  },
  {
    role: "owner",
    icon: Sparkles,
    number: "04",
    title: "Replay it, or ask AI",
    description: "Resend to staging, or get a plain-English breakdown.",
  },
];

function StepChip({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="mt-5 inline-flex max-w-full items-center gap-2 truncate rounded-full border border-border-default bg-bg-base px-3.5 py-2 font-mono text-[12px] text-text-secondary">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted" />
        hooklens.io/h/8k2xq1
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        {["stripe", "razorpay", "github"].map((name) => (
          <span
            key={name}
            className="rounded-full border border-border-default bg-bg-base px-3 py-1.5 text-[11px] text-text-secondary"
          >
            {name}
          </span>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="mt-5 flex flex-col gap-2 rounded-lg border border-border-default bg-bg-base px-3.5 py-2.5 font-mono text-[12px]">
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
          <span className="text-success">POST</span>
          <span className="truncate">/payments.captured</span>
          <span className="ml-auto shrink-0 text-text-muted">now</span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary/70">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted" />
          <span>POST</span>
          <span className="truncate">/charge.failed</span>
          <span className="ml-auto shrink-0 text-text-muted">4s</span>
        </div>
      </div>
    );
  }
  return (
    <button
      type="button"
      className="mt-5 inline-flex items-center gap-2 rounded-full border border-owner-border bg-owner-bg px-3.5 py-2 text-[12px] font-medium text-owner-text"
    >
      <Sparkles size={13} aria-hidden="true" />
      explain this payload
    </button>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-5 py-20 md:py-28"
    >
      <div className="mb-14 text-center">
        <span className="inline-block rounded-full border border-owner-border bg-owner-bg px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-owner-text">
          How hooklens works
        </span>
        <h2 className="mx-auto mt-4 max-w-xl text-[28px] font-semibold leading-tight text-text-primary md:text-[34px]">
          Catch every webhook the moment it fires
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-text-secondary">
          No config, no waiting. Spin up a URL and start inspecting real traffic
          in seconds.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* connecting thread — desktop only */}
        <div className="pointer-events-none absolute left-[6%] right-[6%] top-[38px] hidden h-px bg-border-default lg:block" />
        <motion.div
          className="pointer-events-none absolute top-[35px] hidden h-1.5 w-1.5 rounded-full bg-accent lg:block"
          style={{ left: "6%" }}
          animate={{ left: ["6%", "94%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.08, 0.92, 1],
          }}
        />

        {steps.map((step, i) => {
          const Icon = step.icon;
          const colors = roleStyles[step.role];
          return (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-border-default bg-bg-card px-8 py-6 transition-transform duration-150 hover:-translate-y-0.5"
            >
              {/* big faint number, top-right, like the reference */}
              <span className="pointer-events-none absolute top-6 right-4 select-none font-mono text-[42px] font-bold leading-none text-text-primary/[0.06]">
                {step.number}
              </span>

              <div
                className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg}`}
              >
                <Icon size={24} strokeWidth={1.75} className={colors.icon} />
              </div>

              <h3 className="relative mb-2.5 text-[19px] font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="relative text-[14px] leading-relaxed text-text-secondary">
                {step.description}
              </p>

              <StepChip index={i} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { useRef } from "react";
import { Zap, Radio, Globe, Sparkles } from "lucide-react";

const items = [
  {
    id: "instant",
    icon: Zap,
    title: "Instant setup",
    body: "Get a live, unique URL the moment you create it — no signup friction, no config files to write first.",
    blob: "from-[#FBBF24] to-[#F59E0B]",
    tint: "bg-[#FEF9E7]",
    rotate: -4,
    offsetY: 0,
  },
  {
    id: "capture",
    icon: Sparkles,
    title: "Captures everything",
    body: "Headers, raw body, query params, method — every request is stored exactly as it arrived, no auth required.",
    blob: "from-[#8B7CF6] to-[#6D4EE0]",
    tint: "bg-[#F3F0FF]",
    rotate: 3,
    offsetY: 48,
  },
  {
    id: "live",
    icon: Radio,
    title: "Updates in real time",
    body: "New requests push straight to your dashboard over a socket connection — no refresh, no polling, no delay.",
    blob: "from-[#F472B6] to-[#DB2777]",
    tint: "bg-[#FDF0F6]",
    rotate: -3,
    offsetY: 88,
  },
  {
    id: "explain",
    icon: Globe,
    title: "Explains itself",
    body: "Replay any request and get a plain-English breakdown of what it actually did — no raw JSON to decode by hand.",
    blob: "from-[#60A5FA] to-[#2563EB]",
    tint: "bg-[#EFF6FF]",
    rotate: 4,
    offsetY: 36,
  },
];

function ConnectorLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 1000 620"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M 430 260 C 470 280, 460 300, 520 320"
        stroke="var(--border-default, #D9D5CC)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <path
        d="M 300 400 C 340 420, 400 430, 470 450"
        stroke="var(--border-default, #D9D5CC)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <path
        d="M 560 340 C 520 380, 540 400, 510 440"
        stroke="var(--border-default, #D9D5CC)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
    </svg>
  );
}

function BenefitCard({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;
  return (
    <div
      className="relative w-full max-w-[420px] rounded-[22px] bg-white p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]"
      style={{
        transform: `rotate(${item.rotate}deg) translateY(${item.offsetY}px)`,
      }}
    >
      {/* blob avatar, straddling the top edge of the tinted panel */}
      <div
        className={`absolute left-1/2 top-3 z-10 h-14 w-14 -translate-x-1/2 rounded-full bg-gradient-to-br ${item.blob} shadow-[0_6px_16px_-4px_rgba(0,0,0,0.35)]`}
      />

      <div className={`relative rounded-2xl ${item.tint} px-6 pb-7 pt-14`}>
        <Icon
          size={22}
          strokeWidth={1.75}
          className="mb-6 text-text-primary/70"
        />
        <h3 className="m-0 mb-2 text-[19px] font-bold text-text-primary">
          {item.title}
        </h3>
        <p className="m-0 text-[13.5px] leading-relaxed text-text-secondary">
          {item.body}
        </p>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const container = useRef(null);

  return (
    <section
      ref={container}
      className="relative overflow-hidden px-5 py-20 md:py-28"
      style={{
        backgroundColor: "#F7F6F3",
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(0,0,0,0.035) 40px)",
      }}
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="m-0 mb-3 text-[34px] font-serif font-bold leading-tight text-text-primary md:text-[42px]">
          Why <span className="italic text-accent">choose</span> Hooklens?
        </h2>
        <p className="m-0 text-[15px] text-text-secondary">
          Here's why developers reach for it when debugging webhooks:
        </p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
        <ConnectorLines />
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-center md:justify-self-center"
          >
            <BenefitCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

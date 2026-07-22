import {
  Zap,
  Radio,
  Globe,
  Sparkles,
  Repeat,
  Users,
  ShieldCheck,
} from "lucide-react";

const CARD_HEIGHT = 260;

const items = [
  {
    id: "instant",
    icon: Zap,
    title: "Instant setup",
    body: "Get a live, unique URL the moment you create it — no signup friction, no config files to write first.",
    blob: "from-[#FBBF24] to-[#F59E0B]",
    tint: "bg-[#FEF9E7]",
    rotate: -3,
    style: { top: 0, left: 20, width: 420 },
  },
  {
    id: "capture",
    icon: Sparkles,
    title: "Captures everything",
    body: "Headers, raw body, query params, method — every request is stored exactly as it arrived, no auth required.",
    blob: "from-[#8B7CF6] to-[#6D4EE0]",
    tint: "bg-[#F3F0FF]",
    rotate: 2,
    style: { top: 30, left: 540, width: 420 },
  },
  {
    id: "live",
    icon: Radio,
    title: "Updates in real time",
    body: "New requests push straight to your dashboard over a socket connection — no refresh, no polling, no delay.",
    blob: "from-[#F472B6] to-[#DB2777]",
    tint: "bg-[#FDF0F6]",
    rotate: -2,
    style: { top: 350, left: 60, width: 420 },
  },
  {
    id: "explain",
    icon: Globe,
    title: "Explains itself",
    body: "Replay any request and get a plain-English breakdown of what it actually did — no raw JSON to decode by hand.",
    blob: "from-[#60A5FA] to-[#2563EB]",
    tint: "bg-[#EFF6FF]",
    rotate: 3,
    style: { top: 300, left: 500, width: 420 },
  },
  {
    id: "replay",
    icon: Repeat,
    title: "Replays to anywhere",
    body: "Re-send any captured request to a new target and see status, headers, and latency side by side — no curl script needed.",
    blob: "from-[#34D399] to-[#059669]",
    tint: "bg-[#ECFDF5]",
    rotate: 2,
    style: { top: 650, left: 290, width: 420 },
  },
  {
    id: "team",
    icon: Users,
    title: "Built for teams",
    body: "Share a workspace with Owner, Admin, Member, and Viewer roles — everyone watches the same live requests together.",
    blob: "from-[#5B67E8] to-[#2633CB]",
    tint: "bg-[#ECEEFF]",
    rotate: -3,
    style: { top: 950, left: 60, width: 420 },
  },
  {
    id: "cleanup",
    icon: ShieldCheck,
    title: "Cleans up after itself",
    body: "Requests auto-expire after 7 days and every endpoint is rate-limited and hardened — nothing lingers, nothing leaks.",
    blob: "from-[#9CA3AF] to-[#6B7280]",
    tint: "bg-[#F4F4F5]",
    rotate: 3,
    style: { top: 950, left: 500, width: 420 },
  },
];

// Each connection is either:
// - "h": right-mid of `from` card -> left-mid of `to` card (side-by-side cards)
// - "v": bottom-mid of `from` card -> top-mid of `to` card (cards stacked vertically)
// Endpoints are derived from each card's real top/left/width (+ CARD_HEIGHT),
// so every line's start/end point sits exactly on a card edge — not eyeballed.
const connections: { from: number; to: number; type: "h" | "v" }[] = [
  { from: 0, to: 1, type: "h" }, // instant -> capture
  { from: 0, to: 2, type: "v" }, // instant -> live
  { from: 1, to: 3, type: "v" }, // capture -> explain
  { from: 2, to: 4, type: "v" }, // live -> replay (converge)
  { from: 3, to: 4, type: "v" }, // explain -> replay (converge)
  { from: 4, to: 5, type: "v" }, // replay -> team (diverge)
  { from: 4, to: 6, type: "v" }, // replay -> cleanup (diverge)
];

function getEdgePoints(
  from: (typeof items)[number],
  to: (typeof items)[number],
  type: "h" | "v",
) {
  if (type === "h") {
    return {
      start: {
        x: from.style.left + from.style.width,
        y: from.style.top + CARD_HEIGHT / 2,
      },
      end: { x: to.style.left, y: to.style.top + CARD_HEIGHT / 2 },
    };
  }
  return {
    start: {
      x: from.style.left + from.style.width / 2,
      y: from.style.top + CARD_HEIGHT,
    },
    end: { x: to.style.left + to.style.width / 2, y: to.style.top },
  };
}

const curve = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  `M ${a.x} ${a.y} C ${a.x + (b.x - a.x) * 0.4} ${a.y + (b.y - a.y) * 0.2}, ${
    a.x + (b.x - a.x) * 0.6
  } ${a.y + (b.y - a.y) * 0.8}, ${b.x} ${b.y}`;

function ConnectorLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 1000 1250"
      fill="none"
      preserveAspectRatio="none"
    >
      {connections.map(({ from, to, type }) => {
        const { start, end } = getEdgePoints(items[from], items[to], type);
        return (
          <path
            key={`${items[from].id}-${items[to].id}`}
            d={curve(start, end)}
            stroke="#D9D5CC"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        );
      })}
    </svg>
  );
}

function BenefitCard({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;
  return (
    <div
      className="absolute rounded-[22px] bg-white p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]"
      style={{
        top: item.style.top,
        left: item.style.left,
        width: item.style.width,
        height: CARD_HEIGHT,
        transform: `rotate(${item.rotate}deg)`,
      }}
    >
      <div
        className={`absolute left-1/2 top-3 z-10 h-14 w-14 -translate-x-1/2 rounded-full bg-gradient-to-br ${item.blob} shadow-[0_6px_16px_-4px_rgba(0,0,0,0.35)]`}
      />
      <div
        className={`relative h-full rounded-2xl ${item.tint} px-6 pb-7 pt-14`}
      >
        <Icon
          size={22}
          strokeWidth={1.75}
          className="mb-6 text-[#141412]/70 dark:text-[#ececec]/70"
        />
        <h3 className="m-0 mb-2 text-[19px] font-bold text-[#141412] dark:text-[#ececec]">
          {item.title}
        </h3>
        <p className="m-0 text-[13.5px] leading-relaxed text-[#888780] dark:text-[#404040]">
          {item.body}
        </p>
      </div>
    </div>
  );
}

function BenefitCardStacked({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;
  return (
    <div className="relative rounded-[22px] bg-white p-3 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.18)]">
      <div
        className={`absolute left-1/2 top-3 z-10 h-12 w-12 -translate-x-1/2 rounded-full bg-gradient-to-br ${item.blob}`}
      />
      <div className={`relative rounded-2xl ${item.tint} px-5 pb-6 pt-12`}>
        <Icon
          size={20}
          strokeWidth={1.75}
          className="mb-4 text-[#141412]/70 dark:text-[#ececec]/70"
        />
        <h3 className="m-0 mb-2 text-[17px] font-bold text-[#141412] dark:text-[#ececec]">
          {item.title}
        </h3>
        <p className="m-0 text-[13px] leading-relaxed text-[#888780] dark:text-[#404040]">
          {item.body}
        </p>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      className="px-5 py-20 md:py-28"
      style={{ backgroundColor: "#F7F6F3" }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="m-0 mb-3 text-[34px] font-serif font-bold leading-tight text-[#141412] dark:text-[#ececec] md:text-[42px]">
          Why <span className="italic text-[#2633CB]">choose</span> Hooklens?
        </h2>
        <p className="m-0 text-[15px] text-[#888780] dark:text-[#404040]">
          Here's why developers reach for it when debugging webhooks:
        </p>
      </div>

      <div
        className="relative mx-auto mt-16 hidden md:block"
        style={{
          width: 1000,
          maxWidth: "100%",
          height: 1250,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(0,0,0,0.05) 40px)",
        }}
      >
        <ConnectorLines />
        {items.map((item) => (
          <BenefitCard key={item.id} item={item} />
        ))}
      </div>

      <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-6 md:hidden">
        {items.map((item) => (
          <BenefitCardStacked key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

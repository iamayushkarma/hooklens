import {
  Zap,
  Radio,
  Globe,
  Sparkles,
  Repeat,
  Users,
  ShieldCheck,
} from "lucide-react";

import yellowPin from "@/features/public/assets/yellowPin.png";
import purplePin from "@/features/public/assets/purplePin.png";
import pinkPin from "@/features/public/assets/pinkPin.png";
import bluePin from "@/features/public/assets/bluePin.png";
import greenPin from "@/features/public/assets/greenPin.png";
import indigoPin from "@/features/public/assets/indigoPin.png";
import grayPin from "@/features/public/assets/grayPin.png";

const CARD_HEIGHT = 260;

const items = [
  {
    id: "instant",
    icon: Zap,
    title: "Instant setup",
    body: "Get a live, unique URL the moment you create it — no signup friction, no config files to write first.",
    tint: "bg-[#FEF9E7]",
    pin: yellowPin,
    rotate: -3,
    style: { top: 0, left: 20, width: 420 },
  },
  {
    id: "capture",
    icon: Sparkles,
    title: "Captures everything",
    body: "Headers, raw body, query params, method — every request is stored exactly as it arrived, no auth required.",
    tint: "bg-[#F3F0FF]",
    pin: purplePin,
    rotate: 2,
    style: { top: 30, left: 540, width: 420 },
  },
  {
    id: "live",
    icon: Radio,
    title: "Updates in real time",
    body: "New requests push straight to your dashboard over a socket connection — no refresh, no polling, no delay.",
    tint: "bg-[#FDF0F6]",
    pin: pinkPin,
    rotate: -2,
    style: { top: 350, left: 60, width: 420 },
  },
  {
    id: "explain",
    icon: Globe,
    title: "Explains itself",
    body: "Replay any request and get a plain-English breakdown of what it actually did — no raw JSON to decode by hand.",
    tint: "bg-get-bg",
    pin: bluePin,
    rotate: 3,
    style: { top: 300, left: 500, width: 420 },
  },
  {
    id: "replay",
    icon: Repeat,
    title: "Replays to anywhere",
    body: "Re-send any captured request to a new target and see status, headers, and latency side by side — no curl script needed.",
    tint: "bg-patch-bg",
    pin: greenPin,
    rotate: 2,
    style: { top: 650, left: 290, width: 420 },
  },
  {
    id: "team",
    icon: Users,
    title: "Built for teams",
    body: "Share a workspace with Owner, Admin, Member, and Viewer roles — everyone watches the same live requests together.",
    tint: "bg-owner-bg",
    pin: indigoPin,
    rotate: -3,
    style: { top: 950, left: 60, width: 420 },
  },
  {
    id: "cleanup",
    icon: ShieldCheck,
    title: "Cleans up after itself",
    body: "Requests auto-expire after 7 days and every endpoint is rate-limited and hardened — nothing lingers, nothing leaks.",
    tint: "bg-viewer-bg",
    pin: grayPin,
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
            className="stroke-border-strong"
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
      className="absolute rounded-[22px] bg-bg-card p-3 shadow-lg"
      style={{
        top: item.style.top,
        left: item.style.left,
        width: item.style.width,
        height: CARD_HEIGHT,
        transform: `rotate(${item.rotate}deg)`,
      }}
    >
      <img
        src={item.pin}
        alt=""
        className="absolute left-1/2 top-4 z-10 h-12 w-12 -translate-x-1/2 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]"
      />
      <div className="flex h-full flex-col">
        <div className="h-8 shrink-0" />
        <div
          className={`relative flex-1 overflow-hidden rounded-2xl ${item.tint} px-6 pb-6 pt-10`}
        >
          <Icon
            size={22}
            strokeWidth={1.75}
            className="mb-6 text-text-primary/70"
          />
          <h3 className="m-0 mb-2 text-[19px] font-bold text-text-primary">
            {item.title}
          </h3>
          <p className="m-0 line-clamp-3 text-[13.5px] leading-relaxed text-text-secondary">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function BenefitCardStacked({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;
  return (
    <div className="relative rounded-[22px] bg-bg-card p-3 shadow-md">
      <img
        src={item.pin}
        alt=""
        className="absolute left-1/2 top-4 z-10 h-10 w-10 -translate-x-1/2 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
      />
      <div className="flex flex-col">
        <div className="h-6 shrink-0" />
        <div className={`relative rounded-2xl ${item.tint} px-5 pb-6 pt-8`}>
          <Icon
            size={20}
            strokeWidth={1.75}
            className="mb-4 text-text-primary/70"
          />
          <h3 className="m-0 mb-2 text-[17px] font-bold text-text-primary">
            {item.title}
          </h3>
          <p className="m-0 text-[13px] leading-relaxed text-text-secondary">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="bg-bg-base px-5 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="m-0 mb-3 text-[34px] font-serif font-bold leading-tight text-text-primary md:text-[42px]">
          Why <span className="italic text-accent">choose</span> Hooklens?
        </h2>
        <p className="m-0 text-[15px] text-text-secondary">
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

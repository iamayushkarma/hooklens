import { Zap, Radio, Globe, Sparkles } from "lucide-react";

const CARD_HEIGHT = 260; // consistent estimate used for line math below

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
];

// Endpoints are derived from each card's real top/left/width (+ CARD_HEIGHT),
// so every line's start/end point sits exactly on a card edge — not eyeballed.
function ConnectorLines() {
  const card1 = items[0].style;
  const card2 = items[1].style;
  const card3 = items[2].style;
  const card4 = items[3].style;

  // card1 right-mid -> card2 left-mid
  const p1Start = {
    x: card1.left + card1.width,
    y: card1.top + CARD_HEIGHT / 2,
  };
  const p1End = { x: card2.left, y: card2.top + CARD_HEIGHT / 2 };

  // card1 bottom-mid -> card3 top-mid
  const p2Start = {
    x: card1.left + card1.width / 2,
    y: card1.top + CARD_HEIGHT,
  };
  const p2End = { x: card3.left + card3.width / 2, y: card3.top };

  // card2 bottom-mid -> card4 top-mid
  const p3Start = {
    x: card2.left + card2.width / 2,
    y: card2.top + CARD_HEIGHT,
  };
  const p3End = { x: card4.left + card4.width / 2, y: card4.top };

  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M ${a.x} ${a.y} C ${a.x + (b.x - a.x) * 0.4} ${a.y + (b.y - a.y) * 0.2}, ${
      a.x + (b.x - a.x) * 0.6
    } ${a.y + (b.y - a.y) * 0.8}, ${b.x} ${b.y}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 1000 640"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d={curve(p1Start, p1End)}
        stroke="#D9D5CC"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <path
        d={curve(p2Start, p2End)}
        stroke="#D9D5CC"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <path
        d={curve(p3Start, p3End)}
        stroke="#D9D5CC"
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
  );
}

export default function WhyChooseUs() {
  return (
    <section
      className="px-5 py-20 md:py-28"
      style={{ backgroundColor: "#F7F6F3" }}
    >
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
          height: 640,
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

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { FaLinkedinIn, FaCcStripe } from "react-icons/fa";

const ThreadsIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.346 18.44 1.5 15.586 1.472 12.01v-.021c.028-3.575.874-6.43 2.523-8.482C5.845 1.205 8.598.024 12.179 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.508 5.467l-2.242.629c-1.086-3.9-3.828-5.898-8.15-5.935-2.93.023-5.15.934-6.6 2.706-1.36 1.663-2.06 4.09-2.084 7.02.024 2.929.724 5.356 2.084 7.019 1.45 1.772 3.67 2.683 6.6 2.706 2.643-.02 4.395-.65 5.856-2.107 1.665-1.657 1.633-3.694 1.104-4.927-.313-.73-.882-1.34-1.663-1.797-.19 1.36-.617 2.446-1.276 3.235-.878 1.049-2.12 1.63-3.687 1.723-1.19.07-2.34-.21-3.24-.79-1.062-.681-1.684-1.72-1.752-2.925-.135-2.377 1.762-4.085 4.723-4.257.99-.058 1.918-.015 2.775.126-.114-.685-.348-1.229-.699-1.617-.478-.53-1.216-.8-2.195-.806h-.026c-.79 0-1.85.218-2.53 1.256l-1.912-1.303c.911-1.384 2.397-2.147 4.19-2.147h.033c2.99.018 4.769 1.845 4.947 5.05.102.043.203.088.302.135 1.4.66 2.424 1.658 2.962 2.886.746 1.698.813 4.472-1.469 6.716-1.912 1.879-4.226 2.729-7.514 2.752zm.775-10.998c-.19-.017-.383-.026-.58-.026a4.1 4.1 0 0 0-.485.028c-1.482.086-2.376.784-2.322 1.752.058 1.033 1.16 1.514 2.222 1.454 1.024-.06 2.256-.475 2.464-2.816a6.87 6.87 0 0 0-1.3-.392z" />
  </svg>
);

const BlueskyIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 10.8c-.7-1.42-2.65-4.06-4.45-5.36C5.83 4.2 5.1 4.35 4.62 4.6c-.55.28-.62.98-.62 1.36 0 2.68.44 6.5 2.24 8.16.5.47 1.06.7 1.6.7-.7.02-1.4.35-1.9.9-.62.68-.9 1.65-.5 2.63.3.72 1.05 1.4 2.4 1.4 1.9 0 3.5-1.9 4.16-3.1.66 1.2 2.26 3.1 4.16 3.1 1.35 0 2.1-.68 2.4-1.4.4-.98.12-1.95-.5-2.63-.5-.55-1.2-.88-1.9-.9.54 0 1.1-.23 1.6-.7 1.8-1.66 2.24-5.48 2.24-8.16 0-.38-.07-1.08-.62-1.36-.48-.25-1.21-.4-2.93.84C14.65 6.74 12.7 9.38 12 10.8z" />
  </svg>
);

type Platform = {
  key: string;
  icon: (className?: string) => ReactNode;
  bg: string;
  iconColor: string;
};

const platforms: Platform[] = [
  {
    key: "x",
    icon: (c) => <FaCcStripe className={c} />,
    bg: "bg-white",
    iconColor: "text-neutral-900",
  },
  {
    key: "linkedin",
    icon: (c) => <FaLinkedinIn className={c} />,
    bg: "bg-white",
    iconColor: "text-[#0A66C2]",
  },
  {
    key: "threads",
    icon: (c) => <ThreadsIcon className={c} />,
    bg: "bg-white",
    iconColor: "text-neutral-900",
  },
  {
    key: "bluesky",
    icon: (c) => <BlueskyIcon className={c} />,
    bg: "bg-white",
    iconColor: "text-[#1185FE]",
  },
];
// Rest-state offsets (only the front 2 cards are visible, tightly stacked)
const restOffsets = [
  { x: 0, y: 0, rotate: 0 },
  { x: 10, y: 10, rotate: 0 },
];

// Hover-state offsets: the front two cards pull up-and-left ("move ahead")
// to open up room for the back two cards to fan in behind them.
const hoverOffsets = [
  { x: -14, y: -10, rotate: -3 },
  { x: 4, y: 0, rotate: 1 },
  { x: 34, y: 10, rotate: 5 },
  { x: 62, y: 20, rotate: 9 },
];

const cardVariants: Variants = {
  rest: (i: number) => ({
    ...(restOffsets[i] ?? restOffsets[1]),
    scale: 1,
    opacity: i < 2 ? 1 : 0,
    zIndex: platforms.length - i,
  }),
  hover: (i: number) => ({
    ...hoverOffsets[i],
    scale: 1 - i * 0.04,
    opacity: 1,
    zIndex: platforms.length - i,
  }),
};

export default function PublishEverywhereCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full max-w-sm rounded-2xl bg-neutral-50 px-8 py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card stack */}
      <div className="relative h-35 mb-6 mt-2 ml-3">
        {platforms.map((platform, i) => (
          <motion.div
            key={platform.key}
            custom={i}
            variants={cardVariants}
            initial="rest"
            animate={isHovered ? "hover" : "rest"}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute left-0 top-0 w-64 h-32 rounded-xl bg-white shadow-md border border-neutral-100 p-4"
            style={{ transformOrigin: "top left" }}
          >
            {i === 0 ? (
              // Front card: full "post" preview
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 shrink-0 overflow-hidden flex items-center justify-center text-white text-xs font-semibold">
                  ●
                </div>
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-2.5 w-24 rounded-full bg-neutral-200" />
                  <div className="h-2.5 w-14 rounded-full bg-neutral-200" />
                  <div className="h-2.5 w-full rounded-full bg-neutral-200 mt-3" />
                  <div className="h-2.5 w-3/4 rounded-full bg-neutral-200" />
                </div>
                <div className={`absolute top-4 right-4 ${platform.iconColor}`}>
                  {platform.icon("w-5 h-5")}
                </div>
              </div>
            ) : (
              // Background cards: just their platform mark, top-right
              <div className={`absolute top-4 right-4 ${platform.iconColor}`}>
                {platform.icon("w-5 h-5")}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Status line */}
      <div className="h-5 mb-1">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-500"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
              Published on {platforms.length} platforms
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Copy */}
      <h3 className="mb-1 text-lg font-semibold text-neutral-900">
        Inspect every webhook instantly
      </h3>
      <p className="text-sm leading-relaxed text-neutral-500">
        Capture, inspect, replay, and debug incoming webhooks in real time with
        a beautiful developer-first dashboard.
      </p>
    </div>
  );
}

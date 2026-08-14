import { Bell, Search } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { useEffect, useState } from "react";
import CardLayout from "../CardLayout";
import { Eye, RotateCcw, BadgeCheck, MessageSquare } from "lucide-react";
import { FaStripeS } from "react-icons/fa";
import { useCardInteraction } from "@/shared/hooks/useCardInteraction";

function CountUp({
  target,
  start,
  delay = 0,
}: {
  target: number;
  start: boolean;
  delay?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) {
      count.set(0);
      setDisplay(0);
      return;
    }
    const controls = animate(count, target, {
      duration: 1.4,
      delay,
      ease: "easeOut",
    });
    const unsub = rounded.on("change", setDisplay);
    return () => {
      controls.stop();
      unsub();
    };
  }, [start, target, delay]);

  return <span>{display}</span>;
}

const reactions = [
  {
    icon: Eye,
    count: 42,
    bg: "bg-[#EAF3FF]",
    border: "border-[#D3E6FE]",
    text: "text-[#3B6FB0]",
  },
  {
    icon: RotateCcw,
    count: 18,
    bg: "bg-[#EAF8F0]",
    border: "border-[#CFEEDC]",
    text: "text-[#3E9A6C]",
  },
  {
    icon: BadgeCheck,
    count: 12,
    bg: "bg-[#F3F0FF]",
    border: "border-[#E1DBFE]",
    text: "text-[#7159C1]",
  },
  {
    icon: MessageSquare,
    count: 5,
    bg: "bg-[#FDF0F6]",
    border: "border-[#FADCE9]",
    text: "text-[#C1548C]",
  },
];

function ReactionPills({
  show,
  hoverKey,
}: {
  show: boolean;
  hoverKey: number;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key={`pills-${hoverKey}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-1.5 pt-3">
            {reactions.map((r, i) => {
              const Icon = r.icon;
              const maxDigits = Math.max(
                ...reactions.map((r) => String(r.count).length),
              );

              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 6 }}
                  transition={{
                    duration: 0.25,
                    delay: i * 0.25,
                    ease: "easeOut",
                  }}
                  className={`flex items-center gap-1 rounded-xl border ${r.bg} ${r.border} ${r.text} px-2 py-1 sm:px-2.5 text-[11px] sm:text-xs font-medium`}
                >
                  <Icon className="size-3 sm:size-3.5" />
                  <span
                    className="inline-block text-center tabular-nums"
                    style={{ minWidth: `${maxDigits}ch` }}
                  >
                    <CountUp target={r.count} start={show} delay={i * 0.25} />
                  </span>
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PostCard({ style }: { style: string }) {
  const { active: hovered, handlers } = useCardInteraction();
  const { onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd } = handlers;
  const [hoverKey, setHoverKey] = useState(0);

  return (
    <CardLayout
      heading="Debug webhooks together"
      subHeading="Capture, replay, and debug webhooks together."
      layout
      className={style}
      onMouseEnter={() => {
        onMouseEnter();
        setHoverKey((k) => k + 1);
      }}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        layout
        onTouchStart={() => {
          onTouchStart();
          setHoverKey((k) => k + 1);
        }}
        onTouchEnd={onTouchEnd}
        className="flex items-start justify-center py-3 h-44 sm:h-48 select-none"
      >
        <motion.div
          layout
          className="w-full sm:w-[75%] md:w-[60%] rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] p-4 sm:p-5 transition-shadow duration-300 px-3 sm:px-3.5 pb-3 flex flex-col overflow-hidden group-hover:scale-[1.08] transition-all ease-in-out"
          style={{
            boxShadow: hovered
              ? "0 4px 10px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.09)"
              : undefined,
          }}
        >
          <div className="flex items-center justify-between pb-3">
            <h4 className="font-medium text-xs sm:text-sm">#Payments</h4>
            <div className="flex place-items-center justify-center gap-2">
              <Search className="size-3.5 sm:size-4 text-text-secondary" />
              <Bell className="size-3.5 sm:size-4 text-text-secondary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-bg-base size-9 sm:size-10 rounded-md shrink-0 flex items-center justify-center">
              <FaStripeS className="size-4 sm:size-5" />
            </div>
            <div className="w-full min-w-0">
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex gap-2 items-center">
                  <h4 className="text-text-primary font-semibold text-xs sm:text-sm">
                    Stripe
                  </h4>
                  <span className="px-2 sm:px-3 text-[0.6rem] sm:text-[0.65rem] font-medium rounded-full py-0.5 bg-[#EAF8F0] border border-[#CFEEDC] text-[#3E9A6C]">
                    Success
                  </span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm shrink-0">
                  2:13
                </p>
              </div>
              <p className="text-xs sm:text-sm truncate">
                received from Stripe.
              </p>
            </div>
          </div>
          <div className="pl-10 sm:pl-12 flex gap-2 mt-3">
            <span className="w-0.5 h-10 bg-gray-400 rounded-full shrink-0" />
            <p className="text-xs sm:text-sm w-3/4">
              Payload inspected and replayed successfully.
            </p>
          </div>
          <ReactionPills show={hovered} hoverKey={hoverKey} />
        </motion.div>
      </motion.div>
    </CardLayout>
  );
}

export default PostCard;

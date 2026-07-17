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
  { icon: Eye, count: 42 },
  { icon: RotateCcw, count: 18 },
  { icon: BadgeCheck, count: 12 },
  { icon: MessageSquare, count: 5 },
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
                  className="flex items-center gap-1.5 rounded-full border border-border-default bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                >
                  <Icon className="size-3.5" />
                  <CountUp target={r.count} start={show} delay={i * 0.25} />
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
  const [hovered, setHovered] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);

  return (
    <CardLayout
      heading="Debug webhooks together"
      subHeading="Capture, replay, and debug webhooks together."
      layout
      className={style}
      onMouseEnter={() => {
        setHovered(true);
        setHoverKey((k) => k + 1);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div layout className="flex items-start justify-center py-3 h-48">
        <motion.div
          layout
          className="w-[60%] rounded-xl border border-border-default bg-white px-3.5 pb-3 flex flex-col overflow-hidden group-hover:scale-[1.08] duration-200 transition-all ease-in-out"
        >
          <div className="flex items-center justify-between py-3">
            <h4 className="font-medium text-sm">#Payments</h4>
            <div className="flex place-items-center justify-center gap-2">
              <Search className="size-4 text-text-secondary" />
              <Bell className="size-4 text-text-secondary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-bg-base size-10 rounded-md shrink-0 flex items-center justify-center">
              <FaStripeS className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <h4 className="text-text-primary font-semibold text-sm">
                  Stripe
                </h4>
                <p className="text-text-secondary text-sm">2:13</p>
              </div>
              <p className="text-sm truncate">
                payment_intent.succeeded received from Stripe.
              </p>
            </div>
          </div>
          <div className="pl-12 flex gap-2 mt-3">
            <span className="w-0.5 h-10 bg-gray-400 rounded-full shrink-0"></span>
            <p className="text-sm w-3/4">
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

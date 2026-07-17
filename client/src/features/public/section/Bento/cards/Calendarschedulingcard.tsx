import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ListFilter } from "lucide-react";
import CardLayout from "../CardLayout";

// Smooth, restrained spring — used for the "always on" pills and for
// the green pill's slide between rows. Slightly lower stiffness and
// higher damping than before so the layout shift settles instead of
// snapping into place.
const shiftSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 34,
  mass: 0.9,
};

// Spring for the pills that appear on hover. Damping is close enough
// to critical that there's only the faintest settle at the end — a
// soft landing rather than a bounce, but still alive rather than
// linear/eased.
const revealSpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.8,
};

// Orchestrates the stagger: each child pill waits its turn rather
// than all three appearing (or leaving) in lockstep. Slightly gentler
// stagger gaps read as calmer than the original.
const revealGroupVariants = {
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

// Each revealed pill gets its own tiny bit of personality — a
// different starting offset — so all three don't move like one rigid
// unit. Offsets and rotation are smaller than before (no rotation at
// all, and less travel) so the motion reads as smooth rather than
// snappy/playful.
const makeRevealVariants = (y: number) => ({
  hidden: { opacity: 0, scale: 0.85, y },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: revealSpring,
  },
});

const violetVariants = makeRevealVariants(8);
const blueVariants = makeRevealVariants(10);
const amberVariants = makeRevealVariants(6);

// Gradient + border tokens shared by every pill so the palette stays
// consistent between the "always on" pills and the revealed ones.
const pillStyles = {
  blue: "border-blue-200 bg-gradient-to-br from-sky-50 to-blue-100",
  violet: "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-100",
  amber: "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100",
  emerald: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100",
};

export default function CalendarSchedulingCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [greenBelow, setGreenBelow] = useState(false);

  return (
    <CardLayout
      onMouseEnter={() => {
        setIsHovered(true);
        setGreenBelow(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      heading="Keep work moving"
      subHeading="Monitor incoming webhooks, inspect requests, and keep every integration on track."
    >
      <motion.div
        animate={{ scale: isHovered ? 1.015 : 1 }}
        transition={shiftSpring}
        className="rounded-2xl w-3/4 mx-auto bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] p-5 transition-shadow duration-300"
        style={{
          boxShadow: isHovered
            ? "0 4px 10px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.09)"
            : undefined,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-semibold text-gray-900">Feb 6</span>
          <ListFilter className="size-4" />
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <span className="text-[13px] text-gray-400">Mon</span>
          <span className="text-[13px] text-gray-400">Tue</span>
          <span className="text-[13px] text-gray-400">Wed</span>
        </div>
        <div
          className="grid grid-cols-3 gap-2 mt-2"
          style={{ gridTemplateRows: "repeat(2, minmax(0, 2rem))" }}
        >
          <motion.div
            layout
            transition={shiftSpring}
            style={{ gridColumn: 1, gridRow: 1 }}
            className={`h-7 rounded-md border ${pillStyles.blue}`}
          />

          <motion.div
            layout
            transition={shiftSpring}
            style={{ gridColumn: 2, gridRow: greenBelow ? 2 : 1 }}
            className={`h-7 rounded-md border ${pillStyles.emerald}`}
          />

          <motion.div
            layout
            transition={shiftSpring}
            style={{ gridColumn: 1, gridRow: 2 }}
            className={`h-7 rounded-md border ${pillStyles.amber}`}
          />

          <AnimatePresence onExitComplete={() => setGreenBelow(false)}>
            {isHovered && (
              <motion.div
                key="reveal-group"
                style={{ display: "contents" }}
                variants={revealGroupVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div
                  variants={violetVariants}
                  style={{ gridColumn: 2, gridRow: 1 }}
                  className={`h-7 rounded-md border ${pillStyles.violet}`}
                />
                <motion.div
                  variants={blueVariants}
                  style={{ gridColumn: 3, gridRow: 1 }}
                  className={`h-7 rounded-md border ${pillStyles.blue}`}
                />
                <motion.div
                  variants={amberVariants}
                  style={{ gridColumn: 3, gridRow: 2 }}
                  className={`h-7 rounded-md border ${pillStyles.amber}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </CardLayout>
  );
}

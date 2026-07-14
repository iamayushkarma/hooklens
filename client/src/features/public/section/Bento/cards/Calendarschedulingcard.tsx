import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Smooth, restrained spring — used for the "always on" pills and for
// the green pill's slide between rows.
const shiftSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
};

// Bouncier, lower-damping spring — reserved for the pills that pop in
// on hover, so their entrance reads as playful rather than mechanical.
const playfulSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 16,
  mass: 0.7,
};

// Orchestrates the stagger: each child pill waits its turn rather
// than all three appearing (or leaving) in lockstep.
const revealGroupVariants = {
  hidden: {
    transition: { staggerChildren: 0.07, staggerDirection: -1 },
  },
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

// Each revealed pill gets its own tiny bit of personality — a
// different starting rotation/offset — so all three don't move like
// one rigid unit. Combined with the bouncy spring this is what gives
// the "pop in" feel instead of a flat fade.
const makeRevealVariants = (rotate: number, y: number) => ({
  hidden: { opacity: 0, scale: 0.45, y, rotate },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: playfulSpring,
  },
});

const violetVariants = makeRevealVariants(-10, 14);
const blueVariants = makeRevealVariants(8, 18);
const amberVariants = makeRevealVariants(-6, 10);

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

  useEffect(() => {
    if (isHovered) setGreenBelow(true);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full max-w-sm mx-auto rounded-3xl bg-[#fafafa] p-6 transition-colors duration-300"
    >
      {/* Inner calendar card */}
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
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <span className="text-[13px] text-gray-400">Mon</span>
          <span className="text-[13px] text-gray-400">Tue</span>
          <span className="text-[13px] text-gray-400">Wed</span>
        </div>
        <div
          className="grid grid-cols-3 gap-3 mt-2"
          style={{ gridTemplateRows: "repeat(2, minmax(0, 2rem))" }}
        >
          <motion.div
            layout
            transition={shiftSpring}
            style={{ gridColumn: 1, gridRow: 1 }}
            className={`h-8 rounded-md border ${pillStyles.blue}`}
          />

          <motion.div
            layout
            transition={shiftSpring}
            style={{ gridColumn: 2, gridRow: greenBelow ? 2 : 1 }}
            className={`h-8 rounded-md border ${pillStyles.emerald}`}
          />

          <motion.div
            layout
            transition={shiftSpring}
            style={{ gridColumn: 1, gridRow: 2 }}
            className={`h-8 rounded-md border ${pillStyles.amber}`}
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
                  layout
                  variants={violetVariants}
                  style={{ gridColumn: 2, gridRow: 1 }}
                  className={`h-8 rounded-md border ${pillStyles.violet}`}
                />
                <motion.div
                  layout
                  variants={blueVariants}
                  style={{ gridColumn: 3, gridRow: 1 }}
                  className={`h-8 rounded-md border ${pillStyles.blue}`}
                />
                <motion.div
                  layout
                  variants={amberVariants}
                  style={{ gridColumn: 3, gridRow: 2 }}
                  className={`h-8 rounded-md border ${pillStyles.amber}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Text content below the card */}
      <div className="mt-8">
        <h3 className="text-[19px] font-semibold text-gray-900 leading-snug">
          A calendar built for scheduling
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
          See what's scheduled, in review, and ready to ship, across the whole
          team.
        </p>
      </div>
    </div>
  );
}

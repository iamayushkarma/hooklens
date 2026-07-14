import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ORIGINAL_TEXT =
  "We're launching a Command Bar today with great commands and features.";
const PUNCHIER_TEXT =
  "Introducing a game-changing Command Bar ⚡ Lightning-fast with powerful";

const LETTER_STAGGER = 0.012;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: LETTER_STAGGER },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: EASE },
  },
};

const letterVariants = {
  hidden: { opacity: 0, filter: "blur(4px)", y: 4 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.25, ease: EASE },
  },
};

function AnimatedSubtitle({ active }: { active: boolean }) {
  const text = active ? PUNCHIER_TEXT : ORIGINAL_TEXT;

  return (
    <div className="min-h-[4.5em]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? "punchier" : "original"}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AutoGenrateCard() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-82 group bg-gray-50 border border-border-default rounded-md overflow-hidden flex items-center justify-center flex-col cursor-default group"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-accent-subtle blur-[70px]"
        initial={false}
        animate={{
          opacity: isHovered ? 0.9 : 0,
          scale: isHovered ? 1.1 : 0.8,
        }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-4 h-52 w-52 rounded-full bg-danger-bg blur-[80px]"
        initial={false}
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.1 : 0.75,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-16 h-40 w-64 rounded-full bg-warning-bg blur-[90px]"
        initial={false}
        animate={{
          opacity: isHovered ? 0.5 : 0,
          scale: isHovered ? 1.05 : 0.8,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      />

      <div className="relative h-4/6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ease-in-out group-hover:scale-[1.05]">
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 14,
            scale: isHovered ? 1 : 0.9,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 24,
            mass: 0.8,
          }}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 text-sm font-medium flex items-center gap-1.5 shadow-sm"
        >
          <span>⚡</span>
          <span>Make it punchier</span>
          <span>🙌</span>
        </motion.div>

        <motion.div
          layout
          initial={false}
          style={{ transformOrigin: "center" }}
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
            scale: { type: "spring", stiffness: 260, damping: 24 },
          }}
          className="relative w-64 p-4 rounded-md space-y-2 bg-bg-card border border-border-default"
        >
          <div className="flex gap-2 items-center">
            <div className="size-6 bg-black rounded-full shrink-0" />
            <div>HookLens @hooklens</div>
          </div>
          <AnimatedSubtitle active={isHovered} />
        </motion.div>
      </div>

      <div className="relative px-3">
        <h3 className="text-text-primary font-semibold">
          Debug webhooks together
        </h3>
        <p className="text-text-secondary">
          Capture, replay, and debug webhooks together.
        </p>
      </div>
    </div>
  );
}

export default AutoGenrateCard;

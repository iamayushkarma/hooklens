import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { MessageCircle, Repeat2, Heart } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// One spring, used everywhere. This is the key change: every element whose
// size changes on hover now animates through this SAME spring via the
// `layout` prop, instead of the card animating on `layout` while its
// children separately animate `height: 0 -> "auto"` / `width: 0 -> 32`.
// Mixing those two systems is what caused the stutter/rubber-banding —
// the parent's FLIP measurement and the children's own size tweens were
// fighting each other every frame. Letting everything share one layout
// transition is what makes the whole card move as a single, fluid piece.
const SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.8,
} as const;

const orbA: Variants = {
  rest: { opacity: 0, scale: 0.8, transition: { duration: 0.35, ease: EASE } },
  hover: {
    opacity: 0.9,
    scale: 1.1,
    transition: { duration: 0.6, ease: EASE },
  },
};
const orbB: Variants = {
  rest: {
    opacity: 0,
    scale: 0.75,
    transition: { duration: 0.35, ease: EASE, delay: 0.03 },
  },
  hover: {
    opacity: 0.8,
    scale: 1.1,
    transition: { duration: 0.6, ease: EASE, delay: 0.05 },
  },
};
const orbC: Variants = {
  rest: { opacity: 0, scale: 0.8, transition: { duration: 0.35, ease: EASE } },
  hover: {
    opacity: 0.5,
    scale: 1.05,
    transition: { duration: 0.6, ease: EASE, delay: 0.1 },
  },
};

const cardZoom: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: SPRING },
};

// Only opacity (+ a tiny y-nudge) is animated explicitly on the elements
// that mount/unmount. Their *size* is handled by `layout`, so it resizes
// in the same spring as the card instead of tweening height separately.
const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.18, ease: EASE, delay: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE } },
};

function PreviewCars({ style }: { style: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      className={`${style} h-[20.75rem] flex flex-col justify-around py-3 bg-gray-50 rounded-md border border-border-default relative overflow-hidden`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          variants={orbA}
          className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-accent-subtle blur-[70px]"
        />
        <motion.div
          variants={orbB}
          className="absolute -right-12 top-4 h-52 w-52 rounded-full bg-danger-bg blur-[80px]"
        />
        <motion.div
          variants={orbC}
          className="absolute left-1/3 top-16 h-40 w-64 rounded-full bg-warning-bg blur-[90px]"
        />
      </div>

      <motion.div
        variants={cardZoom}
        style={{ transformOrigin: "center" }}
        className="relative h-4/6 flex flex-col items-center justify-center gap-2"
      >
        <motion.div
          layout
          transition={SPRING}
          style={{ transformOrigin: "center", width: isHovered ? 312 : 252 }}
          className="relative p-4 rounded-md bg-bg-card border border-border-default shadow-sm"
        >
          <AnimatePresence initial={false}>
            {isHovered && (
              <motion.div
                key="preview-badge"
                layout
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SPRING}
                className="absolute right-3 top-3 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-text-secondary"
              >
                Preview
              </motion.div>
            )}
          </AnimatePresence>

          {/* Two-column layout: avatar column | content column */}
          <motion.div layout transition={SPRING} className="flex gap-2.5">
            {/* Left column — avatar only exists on hover */}
            <AnimatePresence initial={false} mode="popLayout">
              {isHovered && (
                <motion.img
                  key="avatar"
                  layout
                  src="/avatar.jpg"
                  alt=""
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={SPRING}
                  className="size-8 rounded-full shrink-0 object-cover overflow-hidden"
                />
              )}
            </AnimatePresence>

            {/* Right column — name/handle, paragraphs, stats all share this left edge */}
            <motion.div
              layout
              transition={SPRING}
              className="flex-1 min-w-0 space-y-2 pr-14"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {isHovered && (
                  <motion.div
                    key="header"
                    layout
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={SPRING}
                    className="leading-tight"
                  >
                    <span className="font-semibold">Fabrizio Rinaldi</span>{" "}
                    <span className="text-text-secondary">@linuz90</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p layout transition={SPRING}>
                With Typefully, you know that what you write is exactly what
                you'll get 👌
              </motion.p>

              <AnimatePresence initial={false} mode="popLayout">
                {isHovered && (
                  <motion.div
                    key="stats"
                    layout
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={SPRING}
                    className="flex items-center gap-4 text-sm text-text-secondary"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="size-4" /> 52
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Repeat2 className="size-4" /> 105
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="size-4" /> 1.0K
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative px-3">
        <p className="text-text-secondary">
          With Typefully, you know that what you write is exactly what you'll
          get 👌 No need to worry about how your post will look after
          publishing.
        </p>
      </div>
    </motion.div>
  );
}

export default PreviewCars;

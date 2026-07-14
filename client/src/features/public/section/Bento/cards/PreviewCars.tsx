import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { MessageCircle, Repeat2, Heart } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
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

function PreviewCars({ style }: { style: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      className={`${style} h-83 flex flex-col justify-around py-3 bg-gray-50 rounded-md border border-border-default relative overflow-hidden`}
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
          transition={{ layout: SPRING }}
          style={{ transformOrigin: "center" }}
          className={`relative ${isHovered ? "w-78" : "w-63"} p-4 rounded-md bg-bg-card border border-border-default shadow-sm`}
        >
          <AnimatePresence initial={false}>
            {isHovered && (
              <motion.div
                key="preview-badge"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2, ease: EASE, delay: 0.22 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="absolute right-3 top-3 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-text-secondary"
              >
                Preview
              </motion.div>
            )}
          </AnimatePresence>

          {/* Two-column layout: avatar column | content column */}
          <div className="flex gap-2.5">
            {/* Left column — avatar only exists on hover */}
            <AnimatePresence initial={false}>
              {isHovered && (
                <motion.img
                  key="avatar"
                  src="/avatar.jpg"
                  alt=""
                  initial={{ opacity: 0, width: 0 }}
                  animate={{
                    opacity: 1,
                    width: 32,
                    transition: { duration: 0.25, ease: EASE, delay: 0.22 },
                  }}
                  exit={{
                    opacity: 0,
                    width: 0,
                    transition: { duration: 0.15, ease: EASE },
                  }}
                  className="size-8 rounded-full shrink-0 object-cover overflow-hidden"
                />
              )}
            </AnimatePresence>

            {/* Right column — name/handle, paragraphs, stats all share this left edge */}
            <div className="flex-1 min-w-0 space-y-2 pr-14">
              <AnimatePresence initial={false}>
                {isHovered && (
                  <motion.div
                    key="header"
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: "auto",
                      transition: { duration: 0.25, ease: EASE, delay: 0.22 },
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      height: 0,
                      transition: { duration: 0.15, ease: EASE },
                    }}
                    className="overflow-hidden leading-tight"
                  >
                    <span className="font-semibold">Fabrizio Rinaldi</span>{" "}
                    <span className="text-text-secondary">@linuz90</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p layout="position" transition={{ layout: SPRING }}>
                With Typefully, you know that what you write is exactly what
                you'll get 👌
              </motion.p>

              <AnimatePresence initial={false}>
                {isHovered && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: { duration: 0.2, ease: EASE, delay: 0.3 },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: 0.12, ease: EASE },
                    }}
                    className="flex items-center gap-4 overflow-hidden text-sm text-text-secondary"
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
            </div>
          </div>
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

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Clock3, Database } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const EASE = [0.22, 1, 0.36, 1] as const;

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
          <motion.div layout transition={SPRING} className="flex gap-2.5">
            {isHovered && (
              <motion.div
                layout
                transition={SPRING}
                animate={{
                  backgroundColor: isHovered ? "#181717" : "var(--surface-1)",
                  borderColor: isHovered ? "#181717" : "transparent",
                }}
                className="size-8 rounded-full shrink-0 border flex items-center justify-center overflow-hidden"
              >
                {isHovered && (
                  <FaGithub className="size-4 transition-colors duration-200 text-white" />
                )}
              </motion.div>
            )}

            <motion.div
              layout
              transition={SPRING}
              className="flex-1 min-w-0 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="leading-tight">
                  <AnimatePresence initial={false}>
                    {isHovered && (
                      <motion.span
                        key="handle"
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={SPRING}
                        className="text-text-secondary"
                      >
                        {" "}
                        @iamayushkarma
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence initial={false}>
                  {isHovered && (
                    <motion.span
                      key="verified"
                      layout
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={SPRING}
                      className="shrink-0 rounded-full bg-surface-1 border border-border-default px-2.5 py-0.5 text-xs text-success"
                    >
                      Verified
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Event badge + structured detail, replacing the dense run-on sentence */}
              <div className="space-y-1">
                <span className="inline-block text-[10.5px] text-text-secondary bg-surface-1 py-0.75 rounded">
                  pull_request.opened
                </span>
                <p className="text-text-primary">
                  Review requested for{" "}
                  <span className="font-medium">feature/auth</span> in{" "}
                  <span className="font-medium">hooklens-app</span>
                </p>
              </div>

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
                      <Clock3 className="size-4" />
                      148 ms
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Database className="size-4" />
                      3.2 KB
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default PreviewCars;

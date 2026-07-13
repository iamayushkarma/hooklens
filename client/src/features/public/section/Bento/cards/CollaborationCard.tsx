import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

function CollaborationCard() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-82 group bg-gray-50 border border-border-default rounded-md overflow-hidden flex items-center justify-center flex-col cursor-default"
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

      <div className="relative h-4/6 flex items-center justify-center">
        <motion.div
          layout
          initial={false}
          animate={{ scale: isHovered ? 1.03 : 1 }}
          style={{ transformOrigin: "center" }}
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
            scale: { type: "spring", stiffness: 260, damping: 24 },
          }}
          className="relative p-4 rounded-md space-y-2 bg-bg-card border border-border-default"
        >
          <div className="flex gap-2 items-center">
            <div className="size-6 bg-black rounded-full shrink-0" />
            <div>Messi</div>
          </div>
          <div>Stripe payment failed.</div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="reply"
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {
                    transition: { layout: { duration: 0.2, ease: EASE } },
                  },
                  visible: {
                    transition: {
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 26,
                        mass: 0.8,
                      },
                    },
                  },
                }}
                className="space-y-2"
              >
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      scale: 0.6,
                      transition: { duration: 0.15, ease: EASE },
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 420,
                        damping: 16,
                        mass: 0.6,
                      },
                    },
                  }}
                  className="flex gap-2 items-center pt-1"
                >
                  <div className="size-6 bg-black rounded-full shrink-0" />
                  <div>HookLens AI</div>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -4,
                      filter: "blur(4px)",
                      transition: { duration: 0.15, ease: EASE },
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.35, ease: EASE, delay: 0.08 },
                    },
                  }}
                >
                  Replaying to staging...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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

export default CollaborationCard;

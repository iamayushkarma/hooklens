import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-current opacity-60"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function CollaborationCard() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (isHovered) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 900);
      return () => clearTimeout(timer);
    }
    setIsTyping(false);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-86 py-2 bg-bg-base border border-border-default rounded-md overflow-hidden"
    >
      {/* ambient blue glow — blooms in as the bubble grows, fades as it collapses */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 h-44 w-64 rounded-full bg-gradient-to-br from-blue-500/40 via-sky-400/25 to-transparent blur-3xl"
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.15 : 0.75,
        }}
        transition={{ duration: 0.5, ease: EASE }}
      />

      <div className="relative h-4/6 flex items-center justify-center">
        {/* the box itself scales/fades as it grows, height handled by layout */}
        <motion.div
          layout
          initial={false}
          animate={{ scale: isHovered ? 1.03 : 1, opacity: 1 }}
          style={{ transformOrigin: "center" }}
          transition={{
            layout: { duration: 0.4, ease: EASE },
            scale: { duration: 0.4, ease: EASE },
          }}
          className="relative p-4 rounded-md space-y-2 bg-bg-sidebar border border-border-default"
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ transformOrigin: "top center" }}
                className="space-y-2"
              >
                <div className="flex gap-2 items-center pt-1">
                  <div className="size-6 bg-black rounded-full shrink-0" />
                  <div>HookLens AI</div>
                </div>

                <AnimatePresence mode="wait">
                  {isTyping ? (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <TypingDots />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      Replaying to staging...
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative p-3 space-y-1">
        <h3>Debug webhooks together</h3>
        <p>Capture, replay, and debug webhooks together.</p>
      </div>
    </div>
  );
}

export default CollaborationCard;

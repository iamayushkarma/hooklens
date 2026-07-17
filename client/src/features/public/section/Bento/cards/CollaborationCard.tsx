import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaCcStripe } from "react-icons/fa";
import HooklensLogo from "@/assets/icons/logo-icon.png";
import CardLayout from "../CardLayout";

const EASE = [0.22, 1, 0.36, 1] as const;

function CollaborationCard() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <CardLayout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      heading="Resolve incidents as a team,"
      subHeading="Replay, inspect, and resolve webhooks together."
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
          animate={{ scale: isHovered ? 1.1 : 1 }}
          style={{ transformOrigin: "center" }}
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
            scale: { type: "spring", stiffness: 260, damping: 24 },
          }}
          className="relative p-4 rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col gap-3"
        >
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1 items-center">
              <div className="size-6 rounded-full shrink-0 flex items-center justify-center">
                <FaCcStripe className="size-5" />
              </div>
              <h4 className="text-text-primary font-medium">Stripe</h4>
              <span className="bg-red-100 text-red-700 h-4.5 text-[9px] font-medium px-2.5 rounded-full ml-1 flex items-center">
                Failed
              </span>
            </div>
            <div className="text-text-secondary text-[14.5px] pl-7">
              Stripe payment failed.
            </div>
          </div>

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
                className="space-y-0.5"
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
                  className="flex gap-1 items-center pt-1"
                >
                  <div className="size-6 rounded-full shrink-0 flex items-center justify-center">
                    <img src={HooklensLogo} className="size-4" />
                  </div>
                  <h2 className="text-text-primary font-medium text-[15.5px]">
                    HookLens AI
                  </h2>
                </motion.div>
                <motion.div
                  className="text-text-secondary text-[14.5px]  pl-7"
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
    </CardLayout>
  );
}

export default CollaborationCard;

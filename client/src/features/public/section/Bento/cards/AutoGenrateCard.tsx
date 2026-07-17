import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CardLayout from "../CardLayout";
import { RiSparkling2Fill } from "react-icons/ri";
import HookLensLogo from "@/assets/icons/logo-icon.png";

const EASE = [0.22, 1, 0.36, 1] as const;

const SUMMARY_TEXT =
  "Customer upgraded to the Pro plan. Billing updated and subscription activated successfully.";

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

// Splits by word first, letters second, so the browser can only wrap
// lines *between* words — never mid-word — while letters inside each
// word still stagger-animate individually.
function AnimatedSummary() {
  const words = SUMMARY_TEXT.split(" ");

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-[12.5px] text-text-primary leading-relaxed m-0"
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {word.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </motion.p>
  );
}

// The raw payload state: a compact key-value table showing the real
// webhook event name and fields, dev-tool style, no color fills.
function WebhookPayload() {
  return (
    <motion.div
      key="payload"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: EASE }}
    >
      <div className="mb-2 bg-bg-base w-fit flex items-center">
        <span className="text-[10.5px] text-text-secondary bg-surface-1 px-2 py-0.75 rounded">
          webhook
        </span>
      </div>

      <div className="border border-border-default rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border-default">
          <span className="text-[10px] text-text-muted">event</span>
          <code className="font-mono text-[11px] text-text-primary">
            customer.subscription.updated
          </code>
        </div>
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <span className="text-[10px] text-text-muted">fields</span>
          <code className="font-mono text-[11px] text-text-secondary">
            customer, plan
          </code>
        </div>
      </div>
    </motion.div>
  );
}

// The AI summary state: sparkle-labeled plain-English text in an
// accent-tinted, left-bordered callout.
function AISummary() {
  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: EASE }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <RiSparkling2Fill className="size-3 text-accent" />
        <span className="text-[11px] tracking-wide text-accent uppercase">
          AI summary
        </span>
      </div>

      <div className="border-l-2 text-accent bg-bg-base rounded-none pl-2.5">
        <AnimatePresence mode="wait">
          <AnimatedSummary key="summary-text" />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AutoGenrateCard() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <CardLayout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      heading="Debug webhooks together"
      subHeading="Capture, replay, and debug webhooks together."
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
          layout
          initial={false}
          style={{ transformOrigin: "center" }}
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
          }}
          className="relative w-70 p-3.5 rounded-md space-y-2.5 bg-bg-card border border-border-default"
        >
          <div className="flex gap-2 items-center">
            <div className="size-6 rounded-md shrink-0 bg-bg-sidebar border border-border-default flex items-center justify-center p-1">
              <img src={HookLensLogo} className="size-3.5" />
            </div>
            <h3 className="text-text-primary text-[13px] font-medium">
              HookLens{" "}
              <span className="text-text-muted font-normal ml-0.5">
                @hooklens
              </span>
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {isHovered ? (
              <AISummary key="summary" />
            ) : (
              <WebhookPayload key="payload" />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </CardLayout>
  );
}

export default AutoGenrateCard;

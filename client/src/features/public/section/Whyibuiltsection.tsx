"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "motion/react";

/**
 * "Why I Built HookLens" section
 * - Left: paragraph that reveals word-by-word from muted -> primary text color as the section scrolls into view
 * - Right: gradient orb with webhook-provider badges cross-fading in a loop inside it
 *
 * Uses your existing theme tokens from globals.css (--color-text-muted, --color-text-primary,
 * --color-accent, --color-warning, --color-bg-card, etc.) so it drops into light/dark mode as-is.
 */

const COPY =
  "Every time I integrated Stripe, GitHub, or other third-party services, debugging webhooks meant digging through logs, restarting local servers, and guessing what payload was actually sent. I built HookLens to make webhook debugging instant.";

const PROVIDERS = [
  { name: "Stripe" },
  { name: "GitHub" },
  { name: "Slack" },
  { name: "Discord" },
  { name: "Twilio" },
  { name: "Shopify" },
  { name: "Razorpay" },
  { name: "SendGrid" },
];

// One animated word. Its color interpolates from muted -> primary based on
// where its slice of the scroll range falls relative to overall scroll progress.
function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [
    "var(--color-text-muted)",
    "var(--color-text-primary)",
  ]);

  return (
    <motion.span style={{ color }} className="transition-none">
      {word}{" "}
    </motion.span>
  );
}

function ScrollRevealParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start revealing once the paragraph is 85% up the viewport,
    // finish once it's 35% up — tune to taste.
    offset: ["start 0.85", "start 0.35"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="text-2xl md:text-3xl lg:text-4xl font-medium leading-snug tracking-tight max-w-xl"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

function ProviderOrb() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PROVIDERS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const active = PROVIDERS[index];

  return (
    <div className="relative flex items-center justify-center">
      {/* soft ambient glow behind the orb */}
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, var(--color-warning) 0%, var(--color-accent) 60%, transparent 75%)",
        }}
      />

      {/* the orb itself */}
      <div
        className="relative w-72 h-72 md:w-80 md:h-80 rounded-full shadow-lg overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, var(--color-warning) 0%, transparent 45%), radial-gradient(circle at 70% 80%, var(--color-accent) 0%, transparent 55%), var(--color-bg-card)",
        }}
      >
        {/* subtle inner ring for depth */}
        <div className="absolute inset-3 rounded-full border border-white/10" />

        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -8 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md">
                <span className="font-mono font-semibold text-lg text-[var(--color-accent)]">
                  {active.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-medium tracking-wide text-sm">
                {active.name}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* progress dots */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
          {PROVIDERS.map((p, i) => (
            <span
              key={p.name}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i === index ? "white" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WhyIBuiltSection() {
  return (
    <section className="bg-[var(--color-bg-base)] py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <ScrollRevealParagraph text={COPY} />
        <ProviderOrb />
      </div>
    </section>
  );
}

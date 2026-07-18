"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  MotionValue,
} from "motion/react";
import type { IconType } from "react-icons";
import {
  SiStripe,
  SiGithub,
  SiSlack,
  SiDiscord,
  SiTwilio,
  SiShopify,
  SiRazorpay,
  SiSendgrid,
} from "react-icons/si";

const COPY =
  "Every time I integrated Stripe, GitHub, or other third-party services, debugging webhooks meant digging through logs, restarting local servers, and guessing what payload was actually sent. I built HookLens to make webhook debugging instant.";

type Provider = { name: string; Icon: IconType; color: string };

const PROVIDERS: Provider[] = [
  { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "Slack", Icon: SiSlack, color: "#4A154B" },
  { name: "Discord", Icon: SiDiscord, color: "#5865F2" },
  { name: "Twilio", Icon: SiTwilio, color: "#F22F46" },
  { name: "Shopify", Icon: SiShopify, color: "#7AB55C" },
  { name: "Razorpay", Icon: SiRazorpay, color: "#0C2451" },
  { name: "SendGrid", Icon: SiSendgrid, color: "#51A9E3" },
];

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

  return <motion.span style={{ color }}>{word} </motion.span>;
}

function ScrollRevealParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.25"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 25,
    mass: 0.6,
    restDelta: 0.001,
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="text-2xl md:text-3xl lg:text-4xl font-medium leading-snug tracking-tight"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={i}
            word={word}
            progress={smoothProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

function useProviderLoop(intervalMs = 2200) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PROVIDERS.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [intervalMs]);
  return PROVIDERS[index];
}

function ProviderBadge({ provider }: { provider: Provider }) {
  const Icon = provider.Icon;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={provider.name}
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg">
          <Icon size={28} color={provider.color} />
        </div>
        <span className="text-sm font-medium tracking-wide text-white drop-shadow-sm">
          {provider.name}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

function ProviderOrb() {
  const active = useProviderLoop();

  return (
    <div className="relative w-64 h-64 md:w-72 md:h-72 ml-12">
      <div
        className="absolute inset-0 rounded-full overflow-hidden bg-base"
        style={{ boxShadow: "0 25px 50px -15px rgba(0,0,0,0.4)" }}
      >
        <motion.span
          className="absolute w-2/3 h-2/3 rounded-full blur-2xl opacity-70 bg-accent-hover"
          style={{ top: "-8%", left: "-8%" }}
          animate={{ x: [0, 24, -12, 0], y: [0, 18, -22, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute w-2/3 h-2/3 rounded-full blur-2xl opacity-70 bg-accent-hover"
          style={{ bottom: "-12%", right: "-12%" }}
          animate={{ x: [0, -18, 22, 0], y: [0, -22, 12, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute w-1/2 h-1/2 rounded-full blur-2xl opacity-60 bg-accent-hover"
          style={{ top: "28%", left: "22%" }}
          animate={{ x: [0, 12, -14, 0], y: [0, -12, 16, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 0 46px rgba(0,0,0,0.28)" }}
        />
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 45%)",
            mixBlendMode: "screen",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <ProviderBadge provider={active} />
        </div>
      </div>
    </div>
  );
}

export default function WhyIBuiltSection() {
  return (
    <section className="bg-base py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[65%_35%] gap-12 md:gap-8 items-center">
        <ScrollRevealParagraph text={COPY} />
        <ProviderOrb />
      </div>
    </section>
  );
}

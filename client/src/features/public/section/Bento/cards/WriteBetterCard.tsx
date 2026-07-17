import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import CardLayout from "../CardLayout";

const SLIDE_DISTANCE = 42; // px the blue pill travels to reach the orange pill

export default function WriteBetterCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [merged, setMerged] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const confettiInstance = useRef<confetti.CreateTypes | null>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (canvasRef.current) {
      confettiInstance.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
    }
    return () => {
      confettiInstance.current?.reset();
    };
  }, []);

  // Fires from the pill's live on-screen position (converted to a 0–1 fraction
  // of the canvas), so the burst always starts exactly at the green box —
  // never from a fixed, slightly-off spot.
  const fireConfettiFromPill = useCallback(() => {
    if (!pillRef.current || !canvasRef.current) return;

    const pillRect = pillRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;

    const origin = {
      x:
        (pillRect.left + pillRect.width / 2 - canvasRect.left) /
        canvasRect.width,
      y:
        (pillRect.top + pillRect.height / 2 - canvasRect.top) /
        canvasRect.height,
    };

    const colors = ["#16a34a", "#22c55e", "#15803d", "#4ade80", "#65d48a"];

    // Central burst: wide spread so particles reach every edge of the card.
    confettiInstance.current?.({
      particleCount: 95,
      spread: 130,
      startVelocity: 38,
      gravity: 1.1,
      decay: 0.9,
      scalar: 0.6,
      ticks: 160,
      origin,
      colors,
    });

    // Two angled companion bursts push extra particles toward the far corners
    // so the confetti reads as filling the whole card, not just the pill area.
    confettiInstance.current?.({
      particleCount: 40,
      angle: 200,
      spread: 80,
      startVelocity: 42,
      gravity: 1.1,
      decay: 0.9,
      scalar: 0.55,
      ticks: 160,
      origin,
      colors,
    });
    confettiInstance.current?.({
      particleCount: 40,
      angle: 260,
      spread: 90,
      startVelocity: 34,
      gravity: 1.05,
      decay: 0.9,
      scalar: 0.55,
      ticks: 160,
      origin,
      colors,
    });
  }, []);

  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    setMerged(false);
    hasFiredRef.current = false;
  }, []);

  return (
    <CardLayout
      heading="Verify every webhook"
      subHeading="Validate signatures and payloads with confidence."
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* ambient hover glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(120% 90% at 15% 0%, rgba(196,181,253,0.35) 0%, rgba(196,181,253,0) 55%), radial-gradient(100% 80% at 95% 15%, rgba(251,207,232,0.35) 0%, rgba(251,207,232,0) 60%)",
        }}
      />

      {/* confetti canvas, bound to the outer card and clipped by its overflow-hidden
            so the burst is free to travel across the entire card */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
      />

      {/* mock editor panel */}
      <div className="relative mx-auto mt-2 h-[60%] w-[85%]">
        <motion.div
          className="relative z-10 h-full origin-center rounded-xl border border-gray-200 bg-white"
          animate={{
            scale: isHovered ? 1.055 : 1,
            rotate: isHovered ? 0.5 : 0,
            y: isHovered ? -3 : 0,
            boxShadow: isHovered
              ? "0 20px 34px -12px rgba(15,23,42,0.22)"
              : "0 10px 25px -8px rgba(15,23,42,0.15)",
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-full">
            {/* left column: row list */}
            <div className="flex w-[38%] flex-col">
              <div className="flex flex-1 flex-col justify-center gap-1.5 border-b border-gray-100 px-3">
                <div className="h-1.5 w-9 rounded-full bg-gray-200" />
                <div className="h-1.5 w-6 rounded-full bg-gray-200" />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1.5 border-b border-gray-100 px-3">
                <div className="h-1.5 w-7 rounded-full bg-gray-200" />
                <div className="h-1.5 w-11 rounded-full bg-gray-200" />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1.5 border-b border-gray-100 px-3">
                <div className="h-1.5 w-6 rounded-full bg-gray-200" />
              </div>
              <div className="flex-1 border-b border-gray-100" />
            </div>

            {/* right column: pills + text lines */}
            <div className="relative flex-1 px-4 py-3">
              <motion.div
                layout
                className="relative mb-4 flex h-6 items-center justify-end gap-1.5"
                transition={{
                  layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <AnimatePresence initial={false}>
                  {!merged && (
                    <motion.span
                      key="blue"
                      layout
                      className="h-5 w-9 rounded-full"
                      initial={false}
                      animate={{
                        x: isHovered ? SLIDE_DISTANCE : 0,
                        // Color morphs from blue to orange over the course of the
                        // slide, so by the time it reaches the orange pill the two
                        // are already the same hue and the merge reads as one
                        // continuous transformation instead of a swap.
                        backgroundColor: isHovered ? "#f97316" : "#3b82f6",
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.6,
                        transition: { duration: 0.1, ease: "easeOut" },
                      }}
                      transition={{
                        x: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
                        backgroundColor: {
                          duration: 0.26,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }}
                      onAnimationComplete={() => {
                        if (isHovered && !merged) {
                          setMerged(true);
                        }
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.span
                  ref={pillRef}
                  layout
                  className="flex h-5 items-center justify-center overflow-hidden rounded-full"
                  initial={false}
                  animate={{
                    width: merged ? 56 : 36,
                    backgroundColor: merged ? "#16a34a" : "#f97316",
                  }}
                  transition={{
                    layout: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                    width: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                    backgroundColor: { duration: 0.2, ease: "easeOut" },
                  }}
                  onAnimationComplete={() => {
                    // Fires the instant this pill actually finishes turning
                    // green — not before, and not from a stale position.
                    if (merged && !hasFiredRef.current) {
                      hasFiredRef.current = true;
                      fireConfettiFromPill();
                    }
                  }}
                >
                  <AnimatePresence>
                    {merged && (
                      <motion.svg
                        key="check"
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                      >
                        <motion.path
                          d="M20 6 9 17l-5-5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 0.22,
                            delay: 0.1,
                            ease: "easeOut",
                          }}
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.span>
              </motion.div>

              <div className="flex flex-col gap-2">
                <div className="h-1.5 w-24 rounded-full bg-gray-200" />
                <div className="h-1.5 w-32 rounded-full bg-gray-200" />
                <div className="h-1.5 w-16 rounded-full bg-gray-200" />
                <div className="h-1.5 w-20 rounded-full bg-gray-200" />
                <div className="h-1.5 w-14 rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </CardLayout>
  );
}

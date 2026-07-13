import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

const SLIDE_DISTANCE = 42; // px the blue pill travels to reach the orange pill

export default function WriteBetterCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [merged, setMerged] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<confetti.CreateTypes | null>(null);

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

  const fireConfetti = useCallback(() => {
    confettiInstance.current?.({
      particleCount: 36,
      spread: 55,
      startVelocity: 22,
      gravity: 1.4,
      scalar: 0.55,
      ticks: 110,
      origin: { x: 0.82, y: 0.28 },
      colors: ["#16a34a", "#22c55e", "#15803d", "#4ade80", "#65d48a"],
    });
  }, []);

  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    setMerged(false);
  }, []);

  return (
    <div className="flex min-h-[480px] w-full items-center justify-center bg-gray-50 p-10">
      <motion.div
        className="relative w-[430px] max-w-full rounded-2xl border border-gray-200 bg-white p-5"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        animate={{
          boxShadow: isHovered
            ? "0 16px 36px -14px rgba(15,23,42,0.18)"
            : "0 1px 2px rgba(15,23,42,0.04)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

        {/* mock editor panel */}
        <div className="relative mx-auto mt-2 h-[168px] w-[85%]">
          <motion.div
            className="relative z-10 h-full overflow-hidden rounded-xl border border-gray-200 bg-white"
            animate={{
              boxShadow: isHovered
                ? "0 14px 28px -10px rgba(15,23,42,0.2)"
                : "0 10px 25px -8px rgba(15,23,42,0.15)",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* confetti canvas, clipped to this panel by the parent's overflow-hidden */}
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 z-30 h-full w-full"
            />

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
                <div className="relative mb-4 flex h-6 items-center justify-end">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {!merged ? (
                      <motion.div
                        key="pills"
                        className="relative flex items-center gap-1.5"
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <motion.span
                          className="h-5 w-9 rounded-full bg-blue-500"
                          animate={{ x: isHovered ? SLIDE_DISTANCE : 0 }}
                          transition={{
                            duration: 0.38,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          onAnimationComplete={() => {
                            if (isHovered) {
                              setMerged(true);
                              fireConfetti();
                            }
                          }}
                        />
                        <span className="h-5 w-9 rounded-full bg-orange-500" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="merged"
                        className="flex h-6 w-14 items-center justify-center rounded-full bg-green-600"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 20,
                          mass: 0.6,
                        }}
                      >
                        <motion.svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <motion.path
                            d="M20 6 9 17l-5-5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.12,
                              ease: "easeOut",
                            }}
                          />
                        </motion.svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

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

        {/* text content */}
        <div className="relative mt-6 px-1">
          <h3 className="text-[17px] font-semibold text-gray-900">
            A better place to write
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">
            Turn rough ideas into polished posts with a focused, high-fidelity
            editor.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";

// A single "confident, premium" easing curve and a single spring — reused
// everywhere so the fill, the line, the gradient, and the card lift all
// settle at the same rate instead of drifting out of sync with each other.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.7,
} as const;

const CHART_W = 300;
const CHART_H = 150;

/**
 * Builds a filled area path by sampling a smooth power curve
 * y = baseY - amplitude * t^power at high resolution. Because it's one
 * continuous formula rather than a few control points stitched together,
 * there's no seam or elbow where the curve changes character — a higher
 * `power` keeps it nearly flat for longer before curving up, a lower
 * `power` makes it climb earlier and more steeply. Rest and hover both use
 * the same sample count and the same t=0 value, so the two `d` strings
 * stay structurally identical (for morphing) and the left edge never moves.
 */
function growthPath(
  amplitude: number,
  power: number,
  { w = CHART_W, h = CHART_H, baseY = 130, samples = 48, close = true } = {},
) {
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = t * w;
    const y = baseY - amplitude * Math.pow(t, power);
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }
  if (close) d += ` L${w},${h} L0,${h} Z`;
  return d;
}

// Rest: power of 6 keeps it almost flat for most of the width, with only a
// gentle, still perfectly smooth, uptick near the very end.
const restFillD = growthPath(20, 6);
const restLineD = growthPath(20, 6, { close: false });
// Hover: power of 1.6 gives a continuously accelerating climb — flat-ish at
// the start, steadily steepening all the way to the top-right corner —
// with no bend anywhere along the curve.
const hoverFillD = growthPath(118, 1.6);
const hoverLineD = growthPath(118, 1.6, { close: false });

const fillVariants: Variants = {
  rest: { d: restFillD, transition: SPRING },
  hover: { d: hoverFillD, transition: SPRING },
};

// The stroke redraws itself on every hover (pathLength 0 -> 1), which reads
// as "growth happening" rather than just a shape tweening — the same trick
// used in Stripe/Linear-style dashboard cards.
const lineVariants: Variants = {
  rest: {
    d: restLineD,
    pathLength: 1,
    opacity: 0.9,
    transition: { ...SPRING, duration: 0.3 },
  },
  hover: {
    d: hoverLineD,
    pathLength: 1,
    opacity: 1,
    transition: SPRING,
  },
};

const stopTopVariants: Variants = {
  rest: { stopColor: "#e5e7eb", transition: { duration: 0.4, ease: EASE_OUT } },
  hover: {
    stopColor: "#93c5fd",
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const stopBottomVariants: Variants = {
  rest: { stopColor: "#9ca3af", transition: { duration: 0.4, ease: EASE_OUT } },
  hover: {
    stopColor: "#3b82f6",
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    borderColor: "var(--border-default, #e5e7eb)",
  },
  hover: {
    y: -3,
    boxShadow: "0 16px 32px rgba(0,0,0,0.09)",
    borderColor: "#93c5fd",
    transition: SPRING,
  },
};

// The chart box itself nudges up in scale when the *card* is hovered — kept
// subtle (1.05x) so it reads as a lift, not a zoom.
const chartBoxVariants: Variants = {
  rest: { scale: 1, transition: SPRING },
  hover: { scale: 1.05, transition: SPRING },
};

const numberVariants: Variants = {
  rest: { color: "var(--text-primary, #111827)" },
  hover: {
    color: "#2563eb",
    transition: { duration: 0.3, ease: EASE_OUT, delay: 0.08 },
  },
};

/** Counts a number up/down toward `target` whenever it changes. */
function useCountUp(target: number, duration = 550, delay = 80) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number>(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    if (reduceMotion) {
      setValue(target);
      fromRef.current = target;
      return;
    }

    let start = 0;
    const run = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(run);
      } else {
        fromRef.current = target;
      }
    };

    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(run);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, reduceMotion]);

  return value;
}

interface FollowerGrowthCardProps {
  restFollowers?: number;
  hoverFollowers?: number;
  title?: string;
  description?: string;
}

function FollowerGrowthCard({
  restFollowers = 14,
  hoverFollowers = 156,
  title = "Powerful analytics to grow faster",
  description = "See what worked, spot patterns, and shape your next posts.",
}: FollowerGrowthCardProps) {
  const [isActive, setIsActive] = useState(false);
  const followers = useCountUp(isActive ? hoverFollowers : restFollowers);
  const state = isActive ? "hover" : "rest";

  return (
    <motion.div
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      tabIndex={0}
      initial="rest"
      animate={state}
      variants={cardVariants}
      className="w-full max-w-sm rounded-2xl border bg-white p-4 pb-5 outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      <div className="flex justify-end">
        <ArrowUpRight className="size-4 text-text-secondary" />
      </div>

      <div className="relative -mt-2 h-36 overflow-hidden rounded-xl bg-white">
        <div className="relative z-10 p-4">
          <motion.div
            variants={numberVariants}
            className="text-2xl font-semibold tabular-nums"
          >
            +{followers}
          </motion.div>
          <div className="font-mono text-sm text-text-secondary">Followers</div>
        </div>

        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient
              id="analytics-chart-grad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <motion.stop offset="0%" variants={stopTopVariants} />
              <motion.stop offset="100%" variants={stopBottomVariants} />
            </linearGradient>
          </defs>
          <motion.path
            variants={fillVariants}
            fill="url(#analytics-chart-grad)"
          />
          <motion.path
            variants={lineVariants}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="mt-4 font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </motion.div>
  );
}

export default FollowerGrowthCard;

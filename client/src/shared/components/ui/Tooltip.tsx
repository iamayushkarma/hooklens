import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type TooltipPosition = "top" | "bottom" | "left" | "right";
interface TooltipProp {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
}

function Tooltip({ content, children, position = "top" }: TooltipProp) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const GAP = 8;
    const map: Record<TooltipPosition, { top: number; left: number }> = {
      top: { top: rect.top - GAP, left: rect.left + rect.width / 2 },
      bottom: { top: rect.bottom + GAP, left: rect.left + rect.width / 2 },
      left: { top: rect.top + rect.height / 2, left: rect.left - GAP },
      right: { top: rect.top + rect.height / 2, left: rect.right + GAP },
    };
    setCoords(map[position]);
  };

  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isVisible]);

  const transformClasses: Record<TooltipPosition, string> = {
    top: "-translate-x-1/2 -translate-y-full",
    bottom: "-translate-x-1/2",
    left: "-translate-x-full -translate-y-1/2",
    right: "-translate-y-1/2",
  };
  const arrowClasses: Record<TooltipPosition, string> = {
    top: "absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
    left: "absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
    right: "absolute right-full top-1/2 translate-x-1/2 -translate-y-1/2",
  };

  const animationVariants = {
    top: {
      initial: {
        opacity: 0,
        scale: 0.94,
        y: 2,
      },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.94,
        y: 2,
      },
    },

    bottom: {
      initial: {
        opacity: 0,
        scale: 0.94,
        y: -2,
      },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.94,
        y: -2,
      },
    },

    left: {
      initial: {
        opacity: 0,
        scale: 0.94,
        x: 2,
      },
      animate: {
        opacity: 1,
        scale: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.94,
        x: 2,
      },
    },

    right: {
      initial: {
        opacity: 0,
        scale: 0.94,
        x: -2,
      },
      animate: {
        opacity: 1,
        scale: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.94,
        x: -2,
      },
    },
  };
  const animation = animationVariants[position];
  const isDark = document.documentElement.classList.contains("dark");
  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => {
        updateCoords();
        setIsVisible(true);
      }}
      onMouseLeave={() => setIsVisible(false)}
      className="inline-block"
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              style={{ top: coords.top, left: coords.left }}
              initial={animation.initial}
              animate={animation.animate}
              exit={animation.exit}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className={`
                fixed z-50 whitespace-nowrap rounded-md
                bg-tooltip-bg border border-tooltip-border
                px-2.5 py-1.5 text-[.8rem] text-tooltip-text shadow-xl
                  [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]  ${isDark ? "font-medium" : "font-normal"}
                ${transformClasses[position]}
                `}
            >
              {content}
              {/* Arrow */}
              <div
                className={`h-2 w-2 rotate-45 bg-tooltip-bg ${arrowClasses[position]}`}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

export default Tooltip;

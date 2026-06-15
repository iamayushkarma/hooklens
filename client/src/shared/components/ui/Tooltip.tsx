import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TooltipPosition = "top" | "bottom" | "left" | "right";
interface TooltipProp {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
}

function Tooltip({ content, children, position = "top" }: TooltipProp) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
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
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className={`
                absolute z-50 whitespace-nowrap rounded-md
                bg-tooltip-bg border border-tooltip-border
                px-2.5 py-1.5 text-[.8rem] text-tooltip-text shadow-xl
                  [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility]  ${isDark ? "font-medium" : "font-normal"}
                ${positionClasses[position]}
                `}
          >
            {content}
            {/* Arrow */}
            <div
              className={`h-2 w-2 rotate-45 bg-tooltip-bg ${arrowClasses[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;

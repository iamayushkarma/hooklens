import { type ReactNode } from "react";
import { motion, type Transition } from "motion/react";
import { type Variants } from "motion/react";

interface CardLayoutProp {
  children: ReactNode;
  heading: string;
  subHeading: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  transition?: Transition;
  layout?: boolean;
  initial?: string;
  animate?: string;
  tabIndex?: number;
  variants?: Variants;
}

function CardLayout({
  className,
  heading,
  children,
  subHeading,
  onMouseEnter,
  onMouseLeave,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
  transition,
  layout,
  initial,
  animate,
  tabIndex,
  variants,
}: CardLayoutProp) {
  return (
    <motion.div
      layout={layout}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocus={onFocus}
      onBlur={onBlur}
      transition={transition}
      initial={initial}
      animate={animate}
      tabIndex={tabIndex}
      variants={variants}
      className={`${className} relative h-82 group bg-[#fafafa] border border-border-default rounded-3xl overflow-hidden cursor-default p-6`}
    >
      <div className="relative h-full w-full">{children}</div>

      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-text-primary font-semibold">{heading}</h3>
        <p className="text-text-secondary">{subHeading}</p>
      </div>
    </motion.div>
  );
}

export default CardLayout;

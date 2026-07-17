import { type ReactNode } from "react";
import { motion, type Transition } from "motion/react";

interface CardLayoutProp {
  children: ReactNode;
  heading: string;
  subHeading: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  transition?: Transition;
  layout?: boolean;
  initial?: string;
  animate?: string;
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
  transition,
  layout,
  initial,
  animate,
}: CardLayoutProp) {
  return (
    <motion.div
      layout={layout}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      transition={transition}
      initial={initial}
      animate={animate}
      className={`${className} relative h-82 group bg-[#fafafa] border border-border-default rounded-3xl overflow-hidden  cursor-default p-6`}
    >
      {children}
      <div className="relative">
        <h3 className="text-text-primary font-semibold">{heading}</h3>
        <p className="text-text-secondary">{subHeading}</p>
      </div>
    </motion.div>
  );
}

export default CardLayout;

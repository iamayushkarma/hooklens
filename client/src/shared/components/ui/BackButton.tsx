import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  fallbackHref?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function BackButton({
  onClick,
  fallbackHref = "/",
  showLabel = true,
  label = "Back",
  className = "",
}: BackButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      onClick(e);
      return;
    }
    const cameFromSomewhere =
      window.history.length > 1 && document.referrer !== "";

    if (cameFromSomewhere) {
      window.history.back();
    } else {
      window.location.href = fallbackHref;
    }
  }
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      initial="rest"
      animate="rest"
      className={`
        inline-flex items-center gap-1.5
        rounded-md
        border border-border-default
        bg-bg-card
        cursor-pointer
        px-3 py-1.5
        text-sm font-medium
        text-text-secondary
        transition-colors duration-150
        hover:text-text-primary
        hover:bg-base-hover
        hover:border-border-strong
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent
        focus-visible:ring-offset-2
        ${!showLabel ? "p-2" : ""}
        ${className}
      `}
      aria-label={label}
    >
      <motion.span
        className="flex items-center justify-center"
        variants={{
          rest: { x: 0 },
          hover: { x: -3 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
      </motion.span>

      {showLabel && <span>{label}</span>}
    </motion.button>
  );
}

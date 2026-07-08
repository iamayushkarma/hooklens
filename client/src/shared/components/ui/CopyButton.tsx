import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";

export type CopyButtonSize = "sm" | "md" | "lg";
export type CopyButtonColor = "default" | "accent";

export interface CopyButtonProps {
  content: string;
  size?: CopyButtonSize;
  showLabel?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  color?: CopyButtonColor;
  onCopy?: () => void;
}

const sizeClasses: Record<CopyButtonSize, string> = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const paddedSizeClasses: Record<CopyButtonSize, string> = {
  sm: "h-7 min-w-20 px-2.5 gap-1.5",
  md: "h-8 min-w-24 px-3 gap-1.5",
  lg: "h-10 min-w-28 px-3.5 gap-2",
};

const iconSizes: Record<CopyButtonSize, number> = {
  sm: 13,
  md: 14,
  lg: 16,
};

const textSizes: Record<CopyButtonSize, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};

const colorClasses: Record<CopyButtonColor, string> = {
  default:
    "bg-bg-card border border-border-default text-text-secondary hover:text-text-primary hover:bg-base-hover",
  accent: "bg-accent border border-accent text-white hover:bg-accent-hover",
};

export function CopyButton({
  content,
  size = "md",
  showLabel = false,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  color = "default",
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const checkColorClass = color === "accent" ? "text-white" : "text-success";

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.92 }}
      className={`relative flex items-center justify-center cursor-pointer rounded-md
                  transition-colors duration-150 whitespace-nowrap
                  ${colorClasses[color]}
                  ${showLabel ? paddedSizeClasses[size] : sizeClasses[size]}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`flex items-center justify-center ${showLabel ? "gap-1.5" : "absolute"} ${checkColorClass}`}
          >
            <Check size={iconSizes[size]} strokeWidth={2.25} />
            {showLabel && (
              <span className={textSizes[size]}>{copiedLabel}</span>
            )}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`flex items-center justify-center ${showLabel ? "gap-1.5" : "absolute"}`}
          >
            <Copy size={iconSizes[size]} strokeWidth={2} />
            {showLabel && <span className={textSizes[size]}>{copyLabel}</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default CopyButton;

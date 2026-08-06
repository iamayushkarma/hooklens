import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  shimmer?: boolean;
};

export function Button({
  children,
  loading,
  shimmer,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <>
      <button
        {...props}
        disabled={disabled || loading}
        className={twMerge(
          `
            inline-flex w-fit shrink-0 items-center justify-center gap-2
            whitespace-nowrap
            h-9 rounded-md
            bg-accent
            px-4
            text-sm font-medium text-white
            transition-colors
            hover:bg-accent-hover
            cursor-pointer
            outline-none
            focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-50
          `,
          shimmer && !disabled && !loading && "shimmer-btn",
          className,
        )}
      >
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {loading ? "Loading..." : children}
      </button>

      {shimmer && (
        <style>{`
          .shimmer-btn {
            position: relative;
            overflow: hidden;
          }
          .shimmer-btn::after {
            content: "";
            position: absolute;
            top: -50%;
            left: -100%;
            width: 40px;
            height: 200%;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(255, 255, 255, 0.08) 20%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.08) 80%,
              transparent 100%
            );
            transform: skewX(-40deg);
            animation: shimmer-btn-sweep 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            pointer-events: none;
          }
          @keyframes shimmer-btn-sweep {
            0%   { left: -100%; }
            85%  { left: 130%; }
            100% { left: 130%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .shimmer-btn::after { animation: none; }
          }
        `}</style>
      )}
    </>
  );
}

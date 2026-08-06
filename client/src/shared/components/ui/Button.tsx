import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function Button({
  children,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
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
        className,
      )}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {loading ? "Loading..." : children}
    </button>
  );
}

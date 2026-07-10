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
      disabled={disabled || loading}
      className={`
        inline-flex w-fit shrink-0 items-center justify-center gap-2
        whitespace-nowrap
        h-9 rounded-md
        bg-accent
        px-4
        text-white
        hover:bg-accent-hover
        cursor-pointer
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className ?? ""}
      `}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

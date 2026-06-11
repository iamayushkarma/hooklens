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
        h-11 w-full rounded-md
        bg-accent
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

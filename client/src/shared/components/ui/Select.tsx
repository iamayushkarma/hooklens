interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export function Select({
  label,
  error,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}

      <select
        className={`
        h-10.5
        rounded-lg
        border
        border-border-subtle
        bg-bg-card
        px-3
        text-sm
        font-medium
        outline-none
        transition-all
        focus:border-accent
        focus:ring-2
        focus:ring-accent/15
        ${error ? "border-danger" : ""}
        ${className ?? ""}
      `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

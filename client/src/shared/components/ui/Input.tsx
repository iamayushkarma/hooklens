import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
};

export function Input({
  leftIcon,
  label,
  error,
  isPassword,
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordShowIcon = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="flex flex-col gap-1 relative">
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}

      <input
        type={isPassword ? (showPassword ? "text" : "password") : props.type}
        className={`
          h-11 w-full rounded-md border
          border-border-subtle
           px-3
          text-sm outline-none
          font-medium
          placeholder:font-medium
          placeholder:text-sm
          focus:border-border-strong focus:border-2
          transition-colors
          ${error ? "border-red-500" : ""}
          ${className ?? ""}
        `}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordShowIcon}
          className="absolute right-4 bottom-1 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

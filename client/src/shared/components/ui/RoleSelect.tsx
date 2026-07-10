import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown, Shield, User, Eye } from "lucide-react";

export type SelectableRole = "admin" | "member" | "viewer";

export const roleConfig: Record<
  SelectableRole,
  {
    label: string;
    icon: typeof Shield;
    text: string;
    bg: string;
    border: string;
  }
> = {
  admin: {
    label: "Admin",
    icon: Shield,
    text: "text-admin-text",
    bg: "bg-admin-bg",
    border: "border-admin-border",
  },
  member: {
    label: "Member",
    icon: User,
    text: "text-member-text",
    bg: "bg-member-bg",
    border: "border-member-border",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    text: "text-viewer-text",
    bg: "bg-viewer-bg",
    border: "border-viewer-border",
  },
};

interface RoleSelectProps {
  value: SelectableRole;
  onChange: (value: SelectableRole) => void;
  roles?: SelectableRole[];
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

function RoleSelect({
  value,
  onChange,
  roles = ["admin", "member", "viewer"],
  label,
  disabled,
  fullWidth,
}: RoleSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const current = roleConfig[value];
  const CurrentIcon = current.icon;

  return (
    <div className={fullWidth ? "relative w-full" : "relative inline-block"}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-1.5 text-sm font-medium transition-[background-color,border-color,box-shadow] duration-150 ${
          fullWidth ? "w-full" : "min-w-[120px]"
        } ${current.bg} ${current.border} ${current.text} ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:shadow-[var(--shadow-sm)]"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <CurrentIcon className="h-3.5 w-3.5" />
          {current.label}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        menuPos &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: menuPos.top,
                left: menuPos.left,
                width: Math.max(menuPos.width, 160),
              }}
              className="z-[9999] overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-bg-card p-1 shadow-[var(--shadow-md)]"
            >
              {roles.map((roleValue) => {
                const config = roleConfig[roleValue];
                const Icon = config.icon;
                const isSelected = roleValue === value;

                return (
                  <button
                    key={roleValue}
                    type="button"
                    onClick={() => {
                      onChange(roleValue);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left text-sm transition-colors duration-100 ${
                      isSelected
                        ? `${config.bg} ${config.text}`
                        : "text-text-primary hover:bg-base-hover"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

export default RoleSelect;

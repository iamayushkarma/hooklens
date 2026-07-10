import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ChevronDown,
  Crown,
  Loader2,
  Shield,
  User,
  Eye,
} from "lucide-react";

import { changeMemberRole, type WorkspaceRole } from "../api/changeMemberRole";

interface Props {
  workspaceId: string;
  userId: string;
  currentRole: WorkspaceRole;
  disabled?: boolean;
  onSuccess?: () => void;
}

const roleConfig: Record<
  Exclude<WorkspaceRole, "owner">,
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

const roleOrder: Exclude<WorkspaceRole, "owner">[] = [
  "admin",
  "member",
  "viewer",
];

function MemberRoleSelect({
  workspaceId,
  userId,
  currentRole,
  disabled,
  onSuccess,
}: Props) {
  const [role, setRole] = useState<WorkspaceRole>(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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

  const handleChange = async (value: WorkspaceRole) => {
    setOpen(false);

    if (value === currentRole) return;

    try {
      setLoading(true);
      setError(false);
      setRole(value);

      await changeMemberRole(workspaceId, userId, value);

      onSuccess?.();
    } catch (err) {
      setRole(currentRole);
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (currentRole === "owner") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-owner-border bg-owner-bg px-2.5 py-1 text-xs font-medium text-owner-text">
        <Crown className="h-3 w-3" />
        Owner
      </span>
    );
  }

  const current = roleConfig[role as Exclude<WorkspaceRole, "owner">];
  const CurrentIcon = current.icon;

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        ref={triggerRef}
        type="button"
        disabled={loading || disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`flex min-w-[120px] items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-1.5 text-sm font-medium transition-[background-color,border-color,box-shadow] duration-150 ${current.bg} ${current.border} ${current.text} ${
          disabled || loading
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
                minWidth: Math.max(menuPos.width, 160),
              }}
              className="z-50 overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-bg-card p-1 shadow-[var(--shadow-md)]"
            >
              {roleOrder.map((value) => {
                const config = roleConfig[value];
                const Icon = config.icon;
                const isSelected = value === role;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange(value)}
                    className={`flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2.5 cursor-pointer py-1.5 text-left text-sm transition-colors duration-100 ${
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

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />
          </motion.div>
        )}

        {error && !loading && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-medium text-danger"
          >
            Failed to update
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MemberRoleSelect;

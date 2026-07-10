import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crown, Loader2 } from "lucide-react";

import RoleSelect, {
  type SelectableRole,
} from "@/shared/components/ui/RoleSelect";
import { changeMemberRole, type WorkspaceRole } from "../api/changeMemberRole";

interface Props {
  workspaceId: string;
  userId: string;
  currentRole: WorkspaceRole;
  disabled?: boolean;
  onSuccess?: () => void;
}

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

  const handleChange = async (value: SelectableRole) => {
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

  return (
    <div className="relative inline-flex items-center gap-2">
      <RoleSelect
        value={role as SelectableRole}
        onChange={handleChange}
        disabled={loading || disabled}
      />

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

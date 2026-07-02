import { useState } from "react";

import { Select } from "@/shared/components/ui/Select";

import { changeMemberRole, type WorkspaceRole } from "../api/changeMemberRole";

interface Props {
  workspaceId: string;
  userId: string;
  currentRole: WorkspaceRole;
  disabled?: boolean;
  onSuccess?: () => void;
}

const options = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Member",
    value: "member",
  },
  {
    label: "Viewer",
    value: "viewer",
  },
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

  const handleChange = async (value: WorkspaceRole) => {
    if (value === currentRole) return;

    try {
      setLoading(true);

      setRole(value);

      await changeMemberRole(workspaceId, userId, value);

      onSuccess?.();
    } catch (err) {
      setRole(currentRole);
    } finally {
      setLoading(false);
    }
  };

  if (currentRole === "owner") {
    return <span className="text-sm font-medium">Owner</span>;
  }

  return (
    <Select
      disabled={loading || disabled}
      value={role}
      options={options}
      onChange={(e) => handleChange(e.target.value as WorkspaceRole)}
    />
  );
}

export default MemberRoleSelect;

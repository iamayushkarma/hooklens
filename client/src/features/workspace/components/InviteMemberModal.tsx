import { useState } from "react";

import Modal from "@/shared/components/ui/ModalPortal";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import RoleSelect, {
  type SelectableRole,
} from "@/shared/components/ui/RoleSelect";

import { inviteMember, type InviteMemberPayload } from "../api/inviteMember";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess?: () => void;
}

function InviteMemberModal({
  isOpen,
  onClose,
  workspaceId,
  onSuccess,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteMemberPayload["role"]>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      await inviteMember(workspaceId, {
        email,
        role,
      });

      setEmail("");
      setRole("member");

      onClose();

      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Invite Member
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Invite someone to collaborate in this workspace.
          </p>
        </div>

        <Input
          label="Email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <RoleSelect
          label="Role"
          fullWidth
          roles={["member", "admin", "viewer"]}
          value={role as SelectableRole}
          onChange={(value) => setRole(value as InviteMemberPayload["role"])}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            className="bg-transparent border border-border-subtle hover:text-white! text-text-primary! hover:bg-bg-hover"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button loading={loading} onClick={handleInvite}>
            Send Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default InviteMemberModal;

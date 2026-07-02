import { useState } from "react";

import Modal from "@/shared/components/ui/ModalPortal";
import { Button } from "@/shared/components/ui/Button";

import { cancelInvitation } from "../api/cancelInvitation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  invitationId: string;
  email: string;
  onSuccess: () => void;
}

function CancelInvitationModal({
  isOpen,
  onClose,
  workspaceId,
  invitationId,
  email,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);

      await cancelInvitation(workspaceId, invitationId);

      onSuccess();

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Cancel Invitation</h2>

          <p className="mt-2 text-sm text-text-secondary">
            Cancel invitation for
            <span className="font-medium"> {email}</span>?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-transparent border border-border-default text-text-primary hover:bg-bg-hover"
          >
            Keep
          </Button>

          <Button
            loading={loading}
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancel Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CancelInvitationModal;

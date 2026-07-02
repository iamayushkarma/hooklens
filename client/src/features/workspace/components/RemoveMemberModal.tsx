import Modal from "@/shared/components/ui/ModalPortal";
import { Button } from "@/shared/components/ui/Button";
import { removeMember } from "../api/removeMember";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  userId: string;
  memberName: string;
  onSuccess: () => void;
}

function RemoveMemberModal({
  isOpen,
  onClose,
  workspaceId,
  userId,
  memberName,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setLoading(true);

      await removeMember(workspaceId, userId);

      onSuccess();

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">Remove Member</h2>

        <p className="text-text-secondary">
          Are you sure you want to remove{" "}
          <span className="font-medium">{memberName}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            onClick={handleRemove}
            className="bg-red-600 hover:bg-red-700"
          >
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default RemoveMemberModal;

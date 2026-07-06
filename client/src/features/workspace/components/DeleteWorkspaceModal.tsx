import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "@/shared/components/ui/ModalPortal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

import { deleteWorkspace } from "../api/deleteWorkspace";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DeleteWorkspaceModal({ isOpen, onClose }: DeleteWorkspaceModalProps) {
  const navigate = useNavigate();

  const { currentWorkspace, currentWorkspaceId } = useCurrentWorkspace();

  const [confirmation, setConfirmation] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!currentWorkspace || !currentWorkspaceId) return null;

  const canDelete = confirmation.trim() === currentWorkspace.name;

  const handleDelete = async () => {
    if (!canDelete) {
      setError("Workspace name does not match.");
      return;
    }

    try {
      setLoading(true);

      await deleteWorkspace(currentWorkspaceId);

      onClose();

      navigate("/dashboard/workspaces");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to delete workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-red-500">
            Delete Workspace
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            This action cannot be undone.
            <br />
            Type
            <span className="font-semibold text-text-primary">
              {" "}
              {currentWorkspace.name}
            </span>{" "}
            below to confirm.
          </p>
        </div>

        <Input
          value={confirmation}
          onChange={(e) => {
            setConfirmation(e.target.value);

            if (error) {
              setError("");
            }
          }}
          placeholder={currentWorkspace.name}
          error={error}
        />

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-transparent border border-border-default text-text-primary hover:bg-bg-hover"
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            disabled={!canDelete}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteWorkspaceModal;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertCircle } from "lucide-react";

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10">
            <AlertCircle className="h-5 w-5 text-danger" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-primary">
              Delete Workspace
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 text-sm">
          <p className="text-text-primary">
            You are about to delete the workspace:
          </p>
          <div className="rounded-lg border border-border-default bg-bg-base px-3 py-2.5">
            <p className="font-mono font-semibold text-text-primary">
              {currentWorkspace.name}
            </p>
          </div>
          <p className="leading-relaxed text-text-secondary">
            All projects, endpoints, request history, analytics, and invitations
            will be permanently deleted.
          </p>
        </div>

        {/* Confirmation input */}
        <div className="space-y-2.5">
          <p className="text-sm text-text-primary">
            Type{" "}
            <span className="rounded bg-bg-base px-1.5 py-0.5 font-mono font-semibold">
              {currentWorkspace.name}
            </span>{" "}
            to confirm:
          </p>
          <Input
            value={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder={`Type "${currentWorkspace.name}" here`}
            error={error}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={onClose}
            className="border border-border-default bg-bg-card text-text-primary hover:bg-bg-base"
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            disabled={!canDelete || loading}
            onClick={handleDelete}
            className="flex items-center gap-2 bg-danger hover:bg-red-700 text-white disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteWorkspaceModal;

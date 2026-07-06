import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";

import { deleteProject } from "../api/deleteProject";

interface DeleteProjectModalProps {
  projectId: string;
  projectName: string;
  closeModal: () => void;
  onSuccess: () => void;
}

function DeleteProjectModal({
  projectId,
  projectName,
  closeModal,
  onSuccess,
}: DeleteProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deleteProject(projectId);

      onSuccess();
      closeModal();
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-red-600">Delete Project</h2>

      <p className="mt-2 text-sm text-text-secondary">
        Are you sure you want to delete{" "}
        <span className="font-medium text-text-primary">{projectName}</span>?
      </p>

      <p className="mt-2 text-sm text-red-500">This action cannot be undone.</p>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="cursor-pointer text-text-secondary hover:text-text-primary"
        >
          Cancel
        </button>

        <Button
          className="bg-red-600 hover:bg-red-700"
          disabled={loading}
          onClick={handleDelete}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export default DeleteProjectModal;

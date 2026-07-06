import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

import { updateProject } from "../api/updateProject";

interface EditProjectModalProps {
  projectId: string;
  initialName: string;
  initialDescription: string;
  closeModal: () => void;
  onSuccess: () => void;
}

function EditProjectModal({
  projectId,
  initialName,
  initialDescription,
  closeModal,
  onSuccess,
}: EditProjectModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateProject = () => {
    const value = name.trim();

    if (!value) {
      return "Project name is required";
    }

    if (value.length < 3) {
      return "Project name must be at least 3 characters";
    }

    if (value.length > 100) {
      return "Project name cannot exceed 100 characters";
    }

    if (description.length > 500) {
      return "Description cannot exceed 500 characters";
    }

    return "";
  };

  const handleUpdateProject = async () => {
    const validationError = validateProject();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateProject({
        projectId,
        name: name.trim(),
        description: description.trim(),
      });

      onSuccess();
      closeModal();
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Edit Project</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Update your project details.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium">Project Name</label>

        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            if (error) {
              setError("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdateProject();
            }
          }}
          placeholder="Project name"
          error={error}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe this project..."
          className="mt-2 h-38 w-full resize-none rounded-lg border border-border-default bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="cursor-pointer font-normal text-text-secondary transition-colors hover:text-text-primary"
        >
          Cancel
        </button>

        <Button
          disabled={!name.trim() || loading}
          onClick={handleUpdateProject}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
}

export default EditProjectModal;

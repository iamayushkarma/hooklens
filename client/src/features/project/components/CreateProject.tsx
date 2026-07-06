import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { createProject } from "../api/createProject";
import { useWorkspaceStore } from "@/store/workspace.store";
import { usePermissions } from "@/shared/hooks/usePermissions";

interface CreateProjectProps {
  closeModal: () => void;
  onSuccess: () => void;
}

function CreateProject({ closeModal, onSuccess }: CreateProjectProps) {
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const permissions = usePermissions();

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

  const handleCreateProject = async () => {
    if (!permissions.canCreateProject) {
      setError("You don't have permission to create a project.");
      return;
    }
    const validationError = validateProject();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!workspaceId) {
      setError("Workspace not selected");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createProject({
        workspaceId,
        name: name.trim(),
        description: description.trim(),
      });
      onSuccess();
      closeModal();
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Create Project</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Create a new project inside this workspace.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium">Project Name</label>

        <Input
          value={name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateProject();
            }
          }}
          onChange={(e) => {
            setName(e.target.value);

            if (error) {
              setError("");
            }
          }}
          placeholder="Gitlab Webhook"
          error={error}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this project is used for..."
          rows={4}
          className="mt-2 h-38 resize-none w-full rounded-lg border border-border-default bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
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
          onClick={handleCreateProject}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default CreateProject;

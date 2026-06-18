import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useState } from "react";
import { createWorkspace } from "../api/createWorkspace";

interface CreateWorkspaceProps {
  userInput: string;
  onChange: (value: string) => void;
  closeModal: () => void;
}
function CreateWorkspace({
  userInput,
  onChange,
  closeModal,
}: CreateWorkspaceProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateWorkspaceName = () => {
    const value = userInput.trim();

    if (!value) {
      return "Workspace name is required";
    }

    if (value.length < 3) {
      return "Workspace name must be at least 3 characters";
    }

    if (value.length > 50) {
      return "Workspace name cannot exceed 50 characters";
    }

    return "";
  };
  const handleCreateWorkspace = async () => {
    const validationError = validateWorkspaceName();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    try {
      setLoading(true);

      closeModal();
      await createWorkspace(userInput);
      onChange("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Create Workspace</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Give your workspace a name.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium">Workspace Name</label>
        <Input
          value={userInput}
          onChange={(e) => {
            onChange(e.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="My Workspace"
          error={error}
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => closeModal()}
          className="cursor-pointer font-normal text-text-secondary hover:text-text-primary duration-100 ease-in"
        >
          Cancel
        </button>

        <Button
          disabled={!userInput.trim() || loading}
          onClick={handleCreateWorkspace}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default CreateWorkspace;

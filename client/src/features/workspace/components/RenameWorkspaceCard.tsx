import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

import { updateWorkspace } from "../api/updateWorkspace";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import { RenameWorkspaceCardSkeleton } from "@/shared/components/skletons/WorkspaceSettingsSkeleton";

function RenameWorkspaceCard() {
  const { currentWorkspace, currentWorkspaceId } = useCurrentWorkspace();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name);
    }
  }, [currentWorkspace]);

  const handleSave = async () => {
    if (!currentWorkspaceId) return;

    const value = name.trim();

    if (!value) {
      setError("Workspace name is required");
      return;
    }

    if (value.length < 2) {
      setError("Workspace name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateWorkspace({
        workspaceId: currentWorkspaceId,
        name: value,
      });

      alert("Workspace updated successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update workspace");
    } finally {
      setLoading(false);
    }
  };
  if (!currentWorkspace) {
    return <RenameWorkspaceCardSkeleton />;
  }

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <h2 className="text-lg font-semibold">General</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Update your workspace information.
      </p>

      <div className="mt-6">
        <Input
          label="Workspace Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            if (error) {
              setError("");
            }
          }}
          error={error}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          loading={loading}
          disabled={loading || name.trim() === currentWorkspace?.name}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default RenameWorkspaceCard;

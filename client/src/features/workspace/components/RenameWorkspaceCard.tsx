import { useEffect, useState } from "react";
import { Check } from "lucide-react";

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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name);
    }
  }, [currentWorkspace]);

  const hasChanged = name.trim() !== currentWorkspace?.name;

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
      setSuccess(false);

      await updateWorkspace({
        workspaceId: currentWorkspaceId,
        name: value,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
    <div className="rounded-xl border border-border-default bg-bg-card shadow-sm">
      {/* Content */}
      <div className="space-y-5 px-6 py-6">
        <div>
          <Input
            label="Workspace Name"
            placeholder="Enter workspace name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
              setSuccess(false);
            }}
            error={error}
          />
          <p className="mt-2 text-xs text-text-secondary">
            Choose a name that represents your workspace. Minimum 2 characters.
          </p>
        </div>

        {/* Status messages */}
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-3.5 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3.5 py-3">
            <Check className="h-4 w-4 flex-shrink-0 text-success" />
            <span className="text-sm text-success">
              Workspace updated successfully!
            </span>
          </div>
        )}
      </div>

      {/* Footer with action */}
      <div className="border-t border-border-default bg-bg-base/50 px-6 py-4">
        <div className="flex justify-end">
          <Button
            loading={loading}
            disabled={loading || !hasChanged}
            onClick={handleSave}
            className={`transition-all ${
              hasChanged
                ? "bg-accent hover:bg-accent-hover"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {success ? "✓ Saved" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RenameWorkspaceCard;

import { Settings } from "lucide-react";
import { useParams } from "react-router-dom";
import RenameWorkspaceCard from "../components/RenameWorkspaceCard";
import DeleteWorkspaceCard from "../components/DeleteWorkspaceCard";
import { usePermissions } from "@/shared/hooks/usePermissions";
import BackButton from "@/shared/components/ui/BackButton";

function WorkspaceSettings() {
  const permissions = usePermissions();
  const { workspaceId } = useParams();

  return (
    <div className="space-y-8">
      <BackButton
        fallbackHref={`/dashboard/workspaces/${workspaceId}`}
        label="Back to Projects"
      />

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
          <Settings className="h-5 w-5 text-text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Workspace Settings
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your workspace preferences and configuration
          </p>
        </div>
      </div>

      {/* Settings sections */}
      <div className="space-y-8">
        {/* General section */}
        {permissions.canViewSettings && (
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-text-secondary">
              General
            </h2>
            <RenameWorkspaceCard />
          </div>
        )}

        {/* Danger zone section */}
        {permissions.canDeleteWorkspace && (
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-text-secondary">
              Danger Zone
            </h2>
            <DeleteWorkspaceCard />
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspaceSettings;

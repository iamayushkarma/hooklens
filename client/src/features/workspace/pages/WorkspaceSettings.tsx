import RenameWorkspaceCard from "../components/RenameWorkspaceCard";
import DeleteWorkspaceCard from "../components/DeleteWorkspaceCard";
import { usePermissions } from "@/shared/hooks/usePermissions";

function WorkspaceSettings() {
  const permissions = usePermissions();

  return (
    <div className="space-y-6">
      {permissions.canViewSettings && <RenameWorkspaceCard />}

      {permissions.canDeleteWorkspace && <DeleteWorkspaceCard />}
    </div>
  );
}

export default WorkspaceSettings;

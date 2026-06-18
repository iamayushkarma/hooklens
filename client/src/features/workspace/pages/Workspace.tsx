import { useWorkspaceStore } from "@/store/workspace.store";
import { getWorkspaces } from "../api/getWorkspaces";

function Workspace() {
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
  const projectId = useWorkspaceStore((state) => state.currentProjectId);
  const data = getWorkspaces();
  console.log("Workspace data: ", data);

  return (
    <div>
      <p>Workspace: {workspaceId}</p>
      <p>Project: {projectId}</p>
    </div>
  );
}

export default Workspace;

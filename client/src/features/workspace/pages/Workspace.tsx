import { useWorkspaceStore } from "@/store/workspace.store";
import { getWorkspaces } from "../api/getWorkspaces";
import { useEffect, useState } from "react";
import WorkspaceCard from "../components/WorkspaceCard";
import type { WorkspaceProp } from "../types/workspace.type";
import CreateWorkspace from "../components/CreateWorkspaceBtn";
import CreateWorkspaceBtn from "../components/CreateWorkspaceBtn";

function Workspace() {
  const [workspace, setWorkspace] = useState<WorkspaceProp[]>([]);
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaces = await getWorkspaces();
      setWorkspace(workspaces);
      console.log(workspaces);
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="flex items-center gap-3">
      {workspace.map((workspace) => (
        <WorkspaceCard
          _id={workspace._id}
          name={workspace.name}
          role={workspace.role}
          createdAt={workspace.createdAt}
          updatedAt={workspace.updatedAt}
        />
      ))}
      <CreateWorkspaceBtn />
      {/* <pre>{JSON.stringify(workspace, null, 2)}</pre> */}
    </div>
  );
}

export default Workspace;

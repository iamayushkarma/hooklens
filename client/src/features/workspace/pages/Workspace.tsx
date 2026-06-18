import { useEffect, useState } from "react";
import { getWorkspaces } from "../api/getWorkspaces";
import WorkspaceCard from "../components/WorkspaceCard";
import CreateWorkspaceBtn from "../components/CreateWorkspaceBtn";
import type { WorkspaceProp } from "../types/workspace.type";

function Workspace() {
  const [workspaces, setWorkspaces] = useState<WorkspaceProp[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const data = await getWorkspaces();

      setWorkspaces(data);

      console.log(data);
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace._id} {...workspace} />
      ))}

      <CreateWorkspaceBtn />
    </div>
  );
}

export default Workspace;

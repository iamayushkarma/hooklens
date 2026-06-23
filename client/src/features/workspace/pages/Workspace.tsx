import { useEffect, useState } from "react";
import { getWorkspaces } from "../api/getWorkspaces";
import WorkspaceCard from "../components/WorkspaceCard";
import CreateWorkspaceBtn from "../components/CreateWorkspaceBtn";
import type { WorkspaceProp } from "../types/workspace.type";
import { useWorkspaceStore } from "@/store/workspace.store";
function Workspace() {
  const [workspaces, setWorkspaces] = useState<WorkspaceProp[]>([]);
  const setWorkspaceStore = useWorkspaceStore((state) => state.setWorkspaces);
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const data = await getWorkspaces();

      setWorkspaces(data);
      setWorkspaceStore(data);
      console.log("Workspace data: ", data);
    };

    fetchWorkspaces();
  }, []);

  const totalWorkspaces = workspaces.length;

  const totalProjects = workspaces.reduce(
    (sum, workspace) => sum + workspace.projectCount,
    0,
  );

  return (
    <div className="px-3">
      <div className="">
        {/* Heading */}
        <div className="py-2 pb-3 flex gap-1 flex-col">
          <h2 className="font-semibold text-text-primary text-2xl">
            Workspaces
          </h2>
          <p className="text-text-secondary text-[.9rem]">
            {totalWorkspaces} workspaces · {totalProjects} projects total
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace._id} {...workspace} />
        ))}

        <CreateWorkspaceBtn />
      </div>
    </div>
  );
}

export default Workspace;

import { useEffect, useMemo, useState } from "react";
import { getWorkspaces } from "../api/getWorkspaces";
import WorkspaceCard from "../components/WorkspaceCard";
import CreateWorkspaceBtn from "../components/CreateWorkspaceBtn";
import type { WorkspaceProp } from "../types/workspace.type";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Input } from "@/shared/components/ui/Input";
function Workspace() {
  const [workspaces, setWorkspaces] = useState<WorkspaceProp[]>([]);
  const [serchWorkspaces, setSerchWorkspaces] = useState("");
  const setWorkspaceStore = useWorkspaceStore((state) => state.setWorkspaces);
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const data = await getWorkspaces();

      setWorkspaces(data);
      setWorkspaceStore(data);
    };

    fetchWorkspaces();
  }, []);

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) =>
      workspace.name.toLowerCase().includes(serchWorkspaces.toLowerCase()),
    );
  }, [workspaces, serchWorkspaces]);

  const totalWorkspaces = workspaces.length;

  const totalProjects = workspaces.reduce(
    (sum, workspace) => sum + workspace.projectCount,
    0,
  );

  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        {/* Heading */}
        <div className="py-2 pb-3 flex gap-1 flex-col">
          <h2 className="font-semibold text-text-primary text-2xl">
            Workspaces
          </h2>
          <p className="text-text-secondary text-[.9rem]">
            {totalWorkspaces} workspaces · {totalProjects} projects total
          </p>
        </div>
        {/* Serching */}
        <Input
          isSearch={true}
          className="w-82!"
          placeholder="Search for workspace..."
          value={serchWorkspaces}
          onChange={(e) => setSerchWorkspaces(e.target.value)}
        />
      </div>
      {filteredWorkspaces.length === 0 ? (
        <p className="text-text-secondary">No workspaces found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 ">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace._id} {...workspace} />
          ))}

          {!serchWorkspaces.trim() && <CreateWorkspaceBtn />}
        </div>
      )}
    </div>
  );
}

export default Workspace;

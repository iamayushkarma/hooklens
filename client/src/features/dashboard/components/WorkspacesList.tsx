import { WorkspaceMiniCard } from "./WorkspaceMiniCard";

interface Workspace {
  _id: string;
  name: string;
  yourRole: string;
  projectCount: number;
  memberCount: number;
}

interface WorkspacesListProps {
  workspaces: Workspace[];
}

export function WorkspacesList({ workspaces }: WorkspacesListProps) {
  if (!workspaces.length) {
    return (
      <div className="py-6 text-center text-text-secondary text-[.85rem]">
        No workspaces yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {workspaces.map((ws) => (
        <WorkspaceMiniCard
          key={ws._id}
          id={ws._id}
          name={ws.name}
          role={ws.yourRole}
          projectCount={ws.projectCount}
          memberCount={ws.memberCount}
        />
      ))}
    </div>
  );
}

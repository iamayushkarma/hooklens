import type { WorkspaceProp } from "@/features/workspace/types/workspace.type";
import { FolderKanban, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function WorkspaceCard({ ...workspace }: WorkspaceProp) {
  const navigate = useNavigate();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div
      onClick={() => navigate(`/dashboard/workspaces/${workspace._id}`)}
      className="w-62 rounded-lg border border-border-default bg-bg-card transition-all hover:border-border-hover hover:shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <h2 className="truncate text-base font-semibold">{workspace.name}</h2>

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="cursor-pointer text-text-secondary hover:text-text-primary"
        >
          <Settings className="size-4" />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-4 p-4">
        {/* Role */}
        <div>
          <span className="rounded-full bg-bg-sidebar px-2.5 py-1 text-xs font-medium capitalize">
            {workspace.yourRole}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-text-secondary" />
            <div>
              <p className="text-sm font-semibold">{workspace.memberCount}</p>
              <p className="text-xs text-text-secondary">Members</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FolderKanban className="size-4 text-text-secondary" />
            <div>
              <p className="text-sm font-semibold">{workspace.projectCount}</p>
              <p className="text-xs text-text-secondary">Projects</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border-default pt-3">
          <p className="text-xs text-text-secondary">
            Updated {formatDate(workspace.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCard;

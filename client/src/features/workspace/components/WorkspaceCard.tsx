import type { WorkspaceProp } from "@/features/workspace/types/workspace.type";
import { Settings } from "lucide-react";

function WorkspaceCard({ ...workspace }: WorkspaceProp) {
  function formateDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return (
    <div className="border border-border-default rounded-lg w-62">
      {/* Workspace Name */}
      <div className="border-b-2 border-border-default p-3 flex items-center justify-between">
        <h2>{workspace.name}</h2>
        <span>
          <Settings className="size-4.5" />
        </span>
      </div>
      {/* Workspace Info */}
      <div className="p-3">
        <p>{workspace.role}</p>
        <p>Created At: {formateDate(workspace.createdAt)}</p>
        <p>Created At: {formateDate(workspace.updatedAt)}</p>
      </div>
    </div>
  );
}

export default WorkspaceCard;

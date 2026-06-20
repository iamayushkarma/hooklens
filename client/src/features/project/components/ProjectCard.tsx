import { EllipsisVertical } from "lucide-react";
import type { Project } from "../types/project.types";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspace.store";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const { workspaceId } = useParams();

  const setCurrentProjectId = useWorkspaceStore(
    (state) => state.setCurrentProjectId,
  );

  const projectInitial = project.name.charAt(0).toUpperCase();

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);

    const diffInMinutes = Math.floor(
      (now.getTime() - activityDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }

    return activityDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={() => {
        setCurrentProjectId(project._id);

        navigate(
          `/dashboard/workspaces/${workspaceId}/projects/${project._id}`,
        );
      }}
      className="group cursor-pointer rounded-xl border border-border-default bg-bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-border-hover hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {projectInitial}
          </div>

          <div>
            <h3 className="font-semibold text-text-primary">{project.name}</h3>
          </div>
        </div>

        <button className="opacity-0 transition-opacity group-hover:opacity-100">
          <EllipsisVertical className="size-4 text-text-secondary" />
        </button>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-sm text-text-secondary">
        {project.description || "No description provided"}
      </p>

      {/* Stats */}
      <div className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
        <span>{project.endpointCount} Endpoints</span>

        <span>•</span>

        <span>{project.requestCount} Requests</span>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-border-default pt-3">
        <p className="text-xs text-text-secondary">
          Last activity{" "}
          {project.lastActivityAt
            ? formatRelativeTime(project.lastActivityAt)
            : "No requests yet"}
        </p>
      </div>
    </div>
  );
}

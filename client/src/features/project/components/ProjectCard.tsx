import { Activity, EllipsisVertical } from "lucide-react";
import type { Project } from "../types/project.types";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspace.store";
import { pastelColors } from "@/features/workspace/components/WorkspaceCard";
import { TbPlug } from "react-icons/tb";

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

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const getWorkspaceColor = (name: string) => {
    const hash = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  };

  const color = getWorkspaceColor(projectInitial);

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
          <div
            style={
              {
                "--avatar-bg": color.bg,
                "--avatar-text": color.text,
                "--avatar-dark-bg": color.darkBg,
                "--avatar-dark-text": color.darkText,
                backgroundColor: "var(--avatar-bg)",
                color: "var(--avatar-text)",
              } as React.CSSProperties
            }
            className="flex items-center text-text-primary justify-center rounded-md size-10"
          >
            <span className="p-2.5 text-[.9rem] font-medium">
              {getInitials(projectInitial)}
            </span>
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
      <div className="mt-5 flex items-center gap-5 text-sm text-text-secondary">
        <div className="flex items-center justify-center gap-1">
          <TbPlug className="size-4 text-accent" />
          <span>{project.endpointCount} Endpoints</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Activity className="size-3.5 text-accent" />
          <span>{project.requestCount} Requests</span>
        </div>
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

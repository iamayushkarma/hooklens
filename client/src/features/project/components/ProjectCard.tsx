// import { EllipsisVertical } from "lucide-react";
// import type { Project } from "../types/project.types";

// interface ProjectCardProps {
//   project: Project;
// }
// export function ProjectCard({ project }: ProjectCardProps) {
//   return (
//     <div className="group rounded-lg border border-border-default bg-bg-card p-5 hover:bg-base-hover transition-colors cursor-pointer">
//       <div className="flex items-start justify-between">
//         <h3 className="font-semibold text-text-primary">{project.name}</h3>

//         <button className="opacity-0 group-hover:opacity-100 transition-opacity">
//           <EllipsisVertical className="size-4 text-text-secondary" />
//         </button>
//       </div>

//       <p className="mt-2 text-sm text-text-secondary line-clamp-2">
//         {project.description}
//       </p>

//       <div className="mt-5 border-t border-border-default pt-3">
//         <p className="text-xs text-text-secondary">
//           Created{" "}
//           {new Date(project.createdAt).toLocaleDateString("en-IN", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//           })}
//         </p>
//       </div>
//     </div>
//   );
// }

import { EllipsisVertical } from "lucide-react";
import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
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
    <div className="group cursor-pointer rounded-xl border border-border-default bg-bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-border-hover hover:shadow-md">
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

import { EllipsisVertical } from "lucide-react";
import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
}
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group rounded-lg border border-border-default bg-bg-card p-5 hover:bg-base-hover transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-text-primary">{project.name}</h3>

        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <EllipsisVertical className="size-4 text-text-secondary" />
        </button>
      </div>

      <p className="mt-2 text-sm text-text-secondary line-clamp-2">
        {project.description}
      </p>

      <div className="mt-5 border-t border-border-default pt-3">
        <p className="text-xs text-text-secondary">
          Created{" "}
          {new Date(project.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

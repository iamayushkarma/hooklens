import { ProjectCardSkeleton } from "./ProjectCardSkeleton";

export function ProjectsPageSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

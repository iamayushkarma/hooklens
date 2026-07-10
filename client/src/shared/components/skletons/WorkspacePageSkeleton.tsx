import { WorkspaceCardSkeleton } from "./WorkspaceCardSkeleton";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

export function WorkspacePageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        {/* Heading */}
        <div className="py-2 pb-3 flex gap-2 flex-col">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-3.5 w-52" />
        </div>
        {/* Search */}
        <SkeletonBlock className="w-82 h-10 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <WorkspaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

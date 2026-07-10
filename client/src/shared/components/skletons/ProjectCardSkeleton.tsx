function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="h-56 rounded-xl border border-border-default bg-bg-card p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="size-9 rounded-md shrink-0" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
        <SkeletonBlock className="h-5 w-14 rounded-full" />
      </div>

      {/* Body / mini stats */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-2 bg-bg-sidebar px-3 py-2.5 rounded-md w-full">
          <SkeletonBlock className="h-2.5 w-12" />
          <SkeletonBlock className="h-4 w-8" />
        </div>
        <div className="flex flex-col gap-2 bg-bg-sidebar px-3 py-2.5 rounded-md w-full">
          <SkeletonBlock className="h-2.5 w-12" />
          <SkeletonBlock className="h-4 w-8" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border-default">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

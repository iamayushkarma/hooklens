function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

export function WorkspaceCardSkeleton() {
  return (
    <div className="rounded-lg border border-border-default bg-bg-card h-56">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="size-10 rounded-md shrink-0" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>

      {/* Stats */}
      <div className="flex items-center p-4 gap-2">
        <div className="flex flex-col gap-2.5 bg-bg-sidebar px-4 py-3 rounded-md w-full">
          <SkeletonBlock className="h-2.5 w-14" />
          <div className="flex items-center gap-2">
            <SkeletonBlock className="size-4 rounded-sm" />
            <SkeletonBlock className="h-4 w-6" />
          </div>
        </div>
        <div className="flex flex-col gap-2.5 bg-bg-sidebar px-4 py-3 rounded-md w-full">
          <SkeletonBlock className="h-2.5 w-14" />
          <div className="flex items-center gap-2">
            <SkeletonBlock className="size-4 rounded-sm" />
            <SkeletonBlock className="h-4 w-6" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 border-border-default pt-3 flex items-center justify-between">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-5 w-24 rounded-md" />
      </div>
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

export function WorkspaceHeaderSkeleton() {
  return (
    <div className="pb-4">
      <SkeletonBlock className="h-7 w-56" />
      <div className="mt-4 flex items-center gap-5">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <div className="flex items-center gap-1.5">
          <SkeletonBlock className="size-4 rounded-sm" />
          <SkeletonBlock className="h-3.5 w-20" />
        </div>
        <div className="flex items-center gap-1.5">
          <SkeletonBlock className="size-4 rounded-sm" />
          <SkeletonBlock className="h-3.5 w-20" />
        </div>
      </div>
    </div>
  );
}

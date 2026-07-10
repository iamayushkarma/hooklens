function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

export function RenameWorkspaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <SkeletonBlock className="h-5 w-24" />
      <SkeletonBlock className="h-3.5 w-56 mt-3" />

      <div className="mt-6 flex flex-col gap-2">
        <SkeletonBlock className="h-3.5 w-28" />
        <SkeletonBlock className="h-10 w-full rounded-md" />
      </div>

      <div className="mt-6 flex justify-end">
        <SkeletonBlock className="h-9 w-32 rounded-md" />
      </div>
    </div>
  );
}

export function DeleteWorkspaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
      <SkeletonBlock className="h-5 w-28" />
      <div className="mt-3 flex flex-col gap-2">
        <SkeletonBlock className="h-3.5 w-full max-w-md" />
        <SkeletonBlock className="h-3.5 w-2/3 max-w-md" />
      </div>
      <div className="mt-6 flex justify-end">
        <SkeletonBlock className="h-9 w-36 rounded-md" />
      </div>
    </div>
  );
}

export function WorkspaceSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <RenameWorkspaceCardSkeleton />
      <DeleteWorkspaceCardSkeleton />
    </div>
  );
}

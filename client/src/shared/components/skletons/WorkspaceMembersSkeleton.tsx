function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

function MemberRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-border-default px-5 py-4 last:border-b-0 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-center">
      {/* Member */}
      <div className="flex min-w-0 items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 min-w-0">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-3 w-24 sm:hidden" />
        </div>
      </div>

      {/* Email — desktop only, matches sm:block on real column */}
      <SkeletonBlock className="hidden h-3.5 w-40 sm:block" />

      {/* Role */}
      <div className="flex items-center justify-between sm:block">
        <SkeletonBlock className="h-3 w-10 sm:hidden" />
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between sm:justify-end">
        <SkeletonBlock className="h-3 w-10 sm:hidden" />
        <SkeletonBlock className="h-5 w-5 rounded-md" />
      </div>
    </div>
  );
}

function InviteRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-border-default p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex flex-col gap-2">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="h-3 w-28" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-7 w-20 rounded-md" />
        <SkeletonBlock className="h-3.5 w-12" />
      </div>
    </div>
  );
}

export function WorkspaceMembersSkeleton({
  memberRows = 4,
  inviteRows = 2,
}: {
  memberRows?: number;
  inviteRows?: number;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-5.5 w-40" />
          <SkeletonBlock className="h-3.5 w-64" />
        </div>
        <SkeletonBlock className="h-9 w-36 rounded-md self-start sm:self-auto" />
      </div>

      {/* Members table */}
      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-4 border-b border-border-default bg-bg-surface px-5 py-3 sm:grid">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-3 w-10" />
          <SkeletonBlock className="h-3 w-10" />
          <SkeletonBlock className="h-3 w-14 ml-auto" />
        </div>
        {Array.from({ length: memberRows }).map((_, i) => (
          <MemberRowSkeleton key={i} />
        ))}
      </div>

      {/* Pending invitations */}
      <div>
        <SkeletonBlock className="h-5.5 w-48 mb-4" />
        <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card">
          {Array.from({ length: inviteRows }).map((_, i) => (
            <InviteRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-base-hover rounded-md ${className}`} />
  );
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border bg-bg-card border-border-default rounded-lg p-4 flex flex-col gap-3"
        >
          <SkeletonBlock className="h-3.5 w-20" />
          <SkeletonBlock className="h-6 w-16" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChartSkeleton() {
  return (
    <div className="lg:col-span-3 border bg-bg-card border-border-default rounded-lg py-2 px-4">
      <div className="py-6 px-2 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-3.5 w-56" />
        </div>
        <SkeletonBlock className="h-9 w-28 rounded-md" />
      </div>
      <div className="h-[260px] flex items-end gap-2 px-2 pb-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <SkeletonBlock key={i} className="flex-1" />
        ))}
      </div>
    </div>
  );
}

export function MethodPieChartSkeleton() {
  return (
    <div className="lg:col-span-2 border bg-bg-card border-border-default rounded-lg py-2 px-4">
      <div className="py-6 px-2 flex flex-col gap-2">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="h-3.5 w-44" />
      </div>
      <div className="flex items-center justify-center py-6">
        <div className="relative size-44">
          <SkeletonBlock className="size-44 rounded-full" />
          <div className="absolute inset-6 bg-bg-card rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-2 pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonBlock className="size-2.5 rounded-full" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BentoSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Top endpoints — tall, spans 2 cols + 2 rows */}
      <div className="lg:col-span-2 lg:row-span-2 border bg-bg-card border-border-default rounded-2xl p-5">
        <SkeletonBlock className="h-4.5 w-32 mb-4" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <SkeletonBlock className="h-5 w-12 rounded-full" />
                <SkeletonBlock className="h-3.5 flex-1 max-w-[180px]" />
              </div>
              <SkeletonBlock className="h-3.5 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Workspaces */}
      <div className="border bg-bg-card border-border-default rounded-2xl p-5">
        <SkeletonBlock className="h-4.5 w-28 mb-4" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock className="size-9 rounded-lg shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <SkeletonBlock className="h-3.5 w-24" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="border bg-bg-card border-border-default rounded-2xl p-5">
        <SkeletonBlock className="h-4.5 w-32 mb-4" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock className="h-5 w-12 rounded-full shrink-0" />
              <SkeletonBlock className="h-3.5 flex-1" />
              <SkeletonBlock className="h-3 w-10 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <SkeletonBlock className="h-6 w-40" />
      <StatsRowSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <AnalyticsChartSkeleton />
        <MethodPieChartSkeleton />
      </div>
      <BentoSectionSkeleton />
    </div>
  );
}

function EndpointSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* General Information Skeleton */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <div className="h-5 w-44 animate-pulse rounded bg-base-hover" />
        <div className="mt-3 mb-5 h-3.5 w-72 animate-pulse rounded bg-base-hover" />

        <div className="space-y-5">
          <div>
            <div className="mb-2 h-3.5 w-24 animate-pulse rounded bg-base-hover" />
            <div className="h-[42px] w-full animate-pulse rounded-lg bg-base-hover" />
            <div className="mt-1.5 h-3 w-56 animate-pulse rounded bg-base-hover" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <div className="mb-1 h-3.5 w-10 animate-pulse rounded bg-base-hover" />
              <div className="h-[42px] w-full animate-pulse rounded-lg bg-base-hover" />
            </div>
            <div>
              <div className="mb-1 h-3.5 w-20 animate-pulse rounded bg-base-hover" />
              <div className="h-[42px] w-full animate-pulse rounded-lg bg-base-hover" />
            </div>
            <div>
              <div className="mb-1 h-3.5 w-28 animate-pulse rounded bg-base-hover" />
              <div className="h-[42px] w-full animate-pulse rounded-lg bg-base-hover" />
            </div>
          </div>

          <div className="flex justify-end">
            <div className="h-9 w-32 animate-pulse rounded-lg bg-base-hover" />
          </div>
        </div>
      </div>

      {/* Webhook URL Skeleton */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <div className="h-5 w-32 animate-pulse rounded bg-base-hover" />
        <div className="mt-3 mb-5 h-3.5 w-64 animate-pulse rounded bg-base-hover" />

        <div className="flex items-center gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-base-hover" />
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-base-hover" />
        </div>
      </div>

      {/* Endpoint Status Skeleton */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <div className="mb-1 flex items-start justify-between">
          <div className="h-5 w-36 animate-pulse rounded bg-base-hover" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-base-hover" />
        </div>
        <div className="mt-3 mb-5 h-3.5 w-52 animate-pulse rounded bg-base-hover" />

        <div className="flex items-center justify-between gap-4">
          <div className="h-3.5 w-96 max-w-full animate-pulse rounded bg-base-hover" />
          <div className="h-9 w-36 shrink-0 animate-pulse rounded-lg bg-base-hover" />
        </div>
      </div>

      {/* Danger Zone Skeleton */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <div className="h-5 w-28 animate-pulse rounded bg-base-hover" />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded bg-base-hover" />
            <div className="h-3.5 w-80 max-w-full animate-pulse rounded bg-base-hover" />
          </div>
          <div className="h-9 w-40 shrink-0 animate-pulse rounded-lg bg-base-hover" />
        </div>
      </div>
    </div>
  );
}

export default EndpointSettingsSkeleton;

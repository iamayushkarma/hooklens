function RequestCardSkeleton() {
  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-4 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Method badge */}
          <div className="h-6 w-14 shrink-0 rounded-md bg-bg-sidebar" />
          {/* IP */}
          <div className="h-4 w-20 shrink-0 rounded bg-bg-sidebar" />
          {/* User agent */}
          <div className="h-4 w-40 rounded bg-bg-sidebar" />
        </div>

        {/* Timestamp */}
        <div className="h-3 w-24 shrink-0 rounded bg-bg-sidebar" />
      </div>

      <div className="mt-2.5 flex items-center gap-4">
        <div className="h-3 w-16 rounded bg-bg-sidebar" />
        <div className="h-3 w-20 rounded bg-bg-sidebar" />
      </div>
    </div>
  );
}

export default RequestCardSkeleton;

import type { TopEndpoint } from "@/features/analytics/types/analytics.types";

interface TopEndpointsTableProps {
  data: TopEndpoint[];
}

export function TopEndpointsTable({ data }: TopEndpointsTableProps) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-text-secondary text-[.85rem]">
        No endpoints yet
      </div>
    );
  }

  const maxCount = Math.max(...data.map((e) => e.requestCount), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((endpoint) => (
        <div key={endpoint._id} className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-text-primary text-[.85rem] font-medium truncate">
                {endpoint.label}
              </p>
              <span className="text-text-secondary text-[.8rem] shrink-0 ml-2">
                {endpoint.requestCount}
              </span>
            </div>
            <div className="h-1.5 bg-bg-sidebar rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${(endpoint.requestCount / maxCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

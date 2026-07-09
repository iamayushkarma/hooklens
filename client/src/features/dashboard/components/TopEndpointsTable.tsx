import { Link } from "react-router-dom";
import type { TopEndpoint } from "@/features/analytics/types/analytics.types";

interface TopEndpointsTableProps {
  data: TopEndpoint[];
  workspaceId: string;
}

export function TopEndpointsTable({
  data,
  workspaceId,
}: TopEndpointsTableProps) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-text-secondary text-[.85rem]">
        No endpoints yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="divide-y divide-border-default">
        {data.map((endpoint) => (
          <div
            key={endpoint._id}
            className="flex items-center justify-between py-3"
          >
            <span className="text-text-primary text-[.85rem] font-medium truncate">
              /{endpoint.slug}
            </span>
            <span className="text-text-secondary text-[.8rem] shrink-0 ml-3">
              {endpoint.requestCount.toLocaleString()} requests
            </span>
          </div>
        ))}
      </div>

      <Link
        to={`/dashboard/workspace/${workspaceId}/endpoints`}
        className="mt-3 text-[.8rem] font-medium text-primary hover:underline self-start"
      >
        View all endpoints
      </Link>
    </div>
  );
}

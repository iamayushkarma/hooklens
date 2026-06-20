import type { Endpoint } from "../types/endpoint.types";

interface EndpointCardProps {
  endpoint: Endpoint;
}

function EndpointCard({ endpoint }: EndpointCardProps) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{endpoint.label}</h3>

          <p className="mt-1 text-sm text-text-secondary">/{endpoint.slug}</p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs ${
            endpoint.isActive
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {endpoint.isActive ? "Active" : "Disabled"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
        <span>{endpoint.requestCount} Requests</span>
      </div>
    </div>
  );
}

export default EndpointCard;

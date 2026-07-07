import type { Endpoint } from "../types/endpoint.types";
import { useNavigate, useParams } from "react-router-dom";
interface EndpointCardProps {
  endpoint: Endpoint;
}

function EndpointCard({ endpoint }: EndpointCardProps) {
  const navigate = useNavigate();

  const { workspaceId, projectId } = useParams();
  return (
    <div
      onClick={() =>
        navigate(
          `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpoint._id}`,
        )
      }
      className="cursor-pointer rounded-lg border border-border-default bg-bg-card p-4 transition-all hover:border-border-hover hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{endpoint.label}</h3>

          <p className="mt-1 text-sm text-text-secondary">/{endpoint.slug}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              endpoint.isActive
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {endpoint.isActive ? "Active" : "Disabled"}
          </span>

          <EndpointActionMenu endpoint={endpoint} onSuccess={onSuccess} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
        <span>{endpoint.requestCount} Requests</span>
      </div>
    </div>
  );
}

export default EndpointCard;

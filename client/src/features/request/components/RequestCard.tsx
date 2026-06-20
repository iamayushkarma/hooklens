import type { RequestLog } from "../types/request.types";
import { useNavigate, useParams } from "react-router-dom";
interface RequestCardProps {
  request: RequestLog;
}

function RequestCard({ request }: RequestCardProps) {
  const navigate = useNavigate();

  const { workspaceId, projectId, endpointId } = useParams();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN");
  };

  return (
    <div
      onClick={() =>
        navigate(
          `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpointId}/requests/${request._id}`,
        )
      }
      className="cursor-pointer rounded-lg border border-border-default bg-bg-card p-4 transition-all hover:border-border-hover hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded bg-bg-sidebar px-2 py-1 text-xs font-medium">
            {request.method}
          </span>

          <span className="text-sm text-text-secondary">{request.ip}</span>
        </div>

        <span className="text-xs text-text-secondary">
          {formatDate(request.createdAt)}
        </span>
      </div>

      <div className="mt-3 text-sm text-text-secondary">
        {request.userAgent}
      </div>

      <div className="mt-3 flex gap-4 text-xs text-text-secondary">
        <span>{request.size} bytes</span>

        <span>{request.contentType}</span>
      </div>
    </div>
  );
}

export default RequestCard;

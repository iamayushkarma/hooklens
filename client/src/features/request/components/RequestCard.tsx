import type { RequestLog } from "../types/request.types";

interface RequestCardProps {
  request: RequestLog;
}

function RequestCard({ request }: RequestCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN");
  };

  return (
    <div className="rounded-lg border border-border-default bg-bg-card p-4">
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

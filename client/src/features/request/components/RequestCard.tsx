import { Clock, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { RequestLog } from "../types/request.types";

interface RequestCardProps {
  request: RequestLog;
}

const methodStyles: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  PATCH: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  DELETE: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function RequestCard({ request }: RequestCardProps) {
  const navigate = useNavigate();
  const { workspaceId, projectId, endpointId } = useParams();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 bytes";
    if (bytes < 1024) return `${bytes} bytes`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div
      onClick={() =>
        navigate(
          `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpointId}/requests/${request._id}`,
        )
      }
      className="cursor-pointer rounded-xl border border-border-default bg-bg-card p-4 transition-all hover:border-border-hover hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${
              methodStyles[request.method] ?? "bg-gray-700 text-white"
            }`}
          >
            {request.method}
          </span>

          <span className="shrink-0 text-sm text-text-secondary">
            {request.ip}
          </span>

          <span className="truncate text-sm text-accent">
            {request.userAgent}
          </span>
        </div>

        <span className="shrink-0 text-xs text-text-secondary whitespace-nowrap">
          {formatDate(request.createdAt)}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {formatSize(request.size)}
        </span>

        {request.contentType && (
          <span className="flex items-center gap-1.5">
            <FileText className="size-3.5" />
            {request.contentType}
          </span>
        )}
      </div>
    </div>
  );
}

export default RequestCard;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRequest } from "@/features/request/api/getRequest";
import type { RequestLog } from "../types/request.types";
import { JsonSection } from "../components/JsonSection";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

function RequestDetail() {
  const { requestId } = useParams();
  const { goBack } = useAppNavigation();

  const [request, setRequest] = useState<RequestLog | null>(null);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      try {
        const data = await getRequest(requestId);
        setRequest(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequest();
  }, [requestId]);

  if (!request) {
    return (
      <div className="rounded-lg border border-border-default p-6">
        Loading request...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          ← Back to Requests
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                request.method === "GET"
                  ? "bg-blue-500/10 text-blue-500"
                  : request.method === "POST"
                    ? "bg-green-500/10 text-green-500"
                    : request.method === "PUT"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : request.method === "DELETE"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-primary/10 text-primary"
              }`}
            >
              {request.method}
            </span>

            <h1 className="text-2xl font-semibold">Request Detail</h1>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border border-border-default px-4 py-2 text-sm hover:bg-bg-sidebar">
              Replay Request
            </button>

            <button className="rounded-lg border border-border-default px-4 py-2 text-sm hover:bg-bg-sidebar">
              AI Explain
            </button>

            <button className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 rounded-lg border border-border-default p-4 md:grid-cols-2">
        <div>
          <p className="text-xs text-text-secondary">IP Address</p>

          <p>{request.ip}</p>
        </div>

        <div>
          <p className="text-xs text-text-secondary">Content Type</p>

          <p>{request.contentType}</p>
        </div>

        <div>
          <p className="text-xs text-text-secondary">Payload Size</p>

          <p>{request.size} bytes</p>
        </div>

        <div>
          <p className="text-xs text-text-secondary">Received At</p>

          <p>{new Date(request.createdAt).toLocaleString()}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs text-text-secondary">User Agent</p>

          <p className="break-all">{request.userAgent}</p>
        </div>
      </div>

      {/* Payload */}
      <JsonSection title="Headers" data={request.headers ?? {}} />

      <JsonSection title="Body" data={request.body ?? {}} />

      <JsonSection title="Query Params" data={request.query ?? {}} />
    </div>
  );
}

export default RequestDetail;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRequest } from "@/features/request/api/getRequest";
import type { RequestLog } from "../types/request.types";
import { JsonSection } from "../components/JsonSection";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import { replayRequest, type ReplayResponse } from "../api/replayRequest";
import { deleteRequest } from "../api/deleteRequest";
import { explainRequest } from "../api/explainRequest";
import ReplayDialog from "../components/ReplayDialog";
import ReplayResult from "../components/ReplayResult";

function RequestDetail() {
  const { requestId } = useParams();
  const { goBack } = useAppNavigation();
  const [explanation, setExplanation] = useState("");

  const [request, setRequest] = useState<RequestLog | null>(null);
  const [showReplayDialog, setShowReplayDialog] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);

  const [replayResult, setReplayResult] = useState<ReplayResponse | null>(null);
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

  const handleExplain = async () => {
    if (!request) return;

    try {
      const res = await explainRequest(request._id);

      setExplanation(res.explanation);
    } catch (error) {
      console.error(error);
    }
  };
  const handleReplay = async (targetUrl: string) => {
    if (!request) return;

    try {
      setReplayLoading(true);

      const result = await replayRequest(request._id, targetUrl);

      setReplayResult(result);

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });

      setShowReplayDialog(false);
    } catch (error) {
      console.error(error);
    } finally {
      setReplayLoading(false);
    }
  };

  if (!request) {
    return (
      <div className="rounded-lg border border-border-default p-6">
        Loading request...
      </div>
    );
  }
  const handleDelete = async () => {
    if (!request) return;

    const confirmed = window.confirm("Delete this request?");

    if (!confirmed) return;

    try {
      await deleteRequest(request._id);

      goBack();
    } catch (error) {
      console.error(error);
    }
  };
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
            <button
              onClick={() => setShowReplayDialog(true)}
              className="rounded-lg border border-border-default px-4 py-2 text-sm hover:bg-bg-sidebar"
            >
              Replay
            </button>

            <button
              onClick={handleExplain}
              className="rounded-lg border px-4 py-2"
            >
              Explain Payload
            </button>

            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
            >
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
      {explanation && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">AI Explanation</h3>

          <p className="mt-2 text-sm">{explanation}</p>
        </div>
      )}
      {replayResult && <ReplayResult result={replayResult} />}
      {/* Payload */}
      <JsonSection title="Headers" data={request.headers ?? {}} />

      <JsonSection title="Body" data={request.body ?? {}} />

      <JsonSection title="Query Params" data={request.query ?? {}} />

      <ReplayDialog
        open={showReplayDialog}
        loading={replayLoading}
        onOpenChange={setShowReplayDialog}
        onReplay={handleReplay}
      />
    </div>
  );
}

export default RequestDetail;

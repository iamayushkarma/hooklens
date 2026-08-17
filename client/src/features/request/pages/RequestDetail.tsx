import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CopyButton from "@/shared/components/ui/CopyButton";
import BackButton from "@/shared/components/ui/BackButton";
import { Button } from "@/shared/components/ui/Button";
import { generateCurl } from "../utils/generateCurl";
import { getRequest } from "@/features/request/api/getRequest";
import type { RequestLog } from "../types/request.types";
import { JsonSection } from "../components/JsonSection";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import { replayRequest, type ReplayResponse } from "../api/replayRequest";
import { deleteRequest } from "../api/deleteRequest";
import { explainRequest } from "../api/explainRequest";
import ReplayDialog from "../components/ReplayDialog";
import ReplayResult from "../components/ReplayResult";
import { LayoutGroup, motion } from "motion/react";

function RequestDetail() {
  const { requestId, workspaceId, projectId, endpointId } = useParams();
  const { goBack } = useAppNavigation();
  const [explanation, setExplanation] = useState("");
  const [activeTab, setActiveTab] = useState<
    "headers" | "body" | "raw" | "query"
  >("headers");
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

  const payloadTabs = [
    { key: "headers", label: "Headers" },
    { key: "body", label: "Body" },
    { key: "raw", label: "Raw Body" },
    { key: "query", label: "Query Params" },
  ];

  if (!request) {
    return (
      <div className=" border border-border-default p-6">
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
      <BackButton
        fallbackHref={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpointId}`}
        label="Back to Requests"
        className="mb-4"
      />

      <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold ${
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

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
                Incoming request
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-text-primary">
                Request Detail
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              content={generateCurl(request)}
              showLabel
              copyLabel="Copy as cURL"
            />

            <Button
              type="button"
              onClick={() => setShowReplayDialog(true)}
              className="bg-bg-base text-text-primary border border-border-default hover:bg-bg-sidebar shadow-sm"
            >
              Replay
            </Button>

            <Button
              type="button"
              onClick={handleExplain}
              className="bg-bg-base text-text-primary border border-border-default hover:bg-bg-sidebar shadow-sm"
            >
              Explain Payload
            </Button>

            <Button
              type="button"
              onClick={handleDelete}
              className="bg-danger hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
            Request metadata
          </p>

          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs text-text-secondary">IP Address</dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">
                {request.ip}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-text-secondary">Content Type</dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">
                {request.contentType}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-text-secondary">Payload Size</dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">
                {request.size} bytes
              </dd>
            </div>

            <div>
              <dt className="text-xs text-text-secondary">Received At</dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">
                {new Date(request.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
            Client details
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-text-secondary">User Agent</p>
              <p className="mt-1 break-all text-sm font-medium text-text-primary">
                {request.userAgent}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Origin</p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {request.ip || "Unknown source"}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Body Type</p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {request.body ? "Structured payload" : "No payload"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-sm">
        <div className="border-b border-border-default bg-bg-sidebar px-3 py-2">
          <LayoutGroup id="request-detail-tabs">
            <div className="flex w-fit gap-2 rounded-md border border-border-default bg-bg-sidebar p-0.75">
              {payloadTabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className="relative rounded-[5px] px-2.5 py-1.5 text-sm cursor-pointer"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="request-detail-tab-pill"
                        layout="position"
                        className="absolute inset-0 rounded-[5px] pointer-events-none border border-border-default bg-bg-card shadow-md"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors ${
                        isActive
                          ? "font-medium text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <div className="min-h-[280px]">
          {activeTab === "headers" && (
            <JsonSection title="Headers" data={request.headers ?? {}} />
          )}

          {activeTab === "body" && (
            <JsonSection title="Body" data={request.body ?? {}} />
          )}

          {activeTab === "query" && (
            <JsonSection title="Query Params" data={request.query ?? {}} />
          )}

          {activeTab === "raw" && (
            <section className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
                <h2 className="text-sm font-semibold text-text-primary">
                  Raw Body
                </h2>

                <CopyButton content={request.rawBody ?? ""} />
              </div>

              <pre className="overflow-auto bg-bg-base p-4 text-sm leading-6 whitespace-pre-wrap break-all text-text-primary">
                {request.rawBody || "No raw body available"}
              </pre>
            </section>
          )}
        </div>
      </div>

      {explanation && (
        <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-text-primary">
              AI Explanation
            </h3>
            <span className="rounded-full bg-accent-subtle px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              AI
            </span>
          </div>

          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-text-secondary">
            {explanation}
          </p>
        </div>
      )}

      {replayResult && <ReplayResult result={replayResult} />}

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

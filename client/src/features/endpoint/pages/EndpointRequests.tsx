import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EndpointEmptyState from "../components/EndpointEmptyState";
import { getRequests } from "@/features/request/api/getRequests";
import type { RequestLog } from "@/features/request/types/request.types";
import RequestCard from "@/features/request/components/RequestCard";
import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { useLiveRequests } from "@/features/request/hook/useLiveRequests";
import CopyButton from "@/shared/components/ui/CopyButton";
import { LayoutGroup, motion } from "motion/react";
import { Input } from "@/shared/components/ui/Input";
import Pagination from "@/shared/components/ui/Pagination";

const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

function EndpointRequests() {
  const { endpointId } = useParams();

  const endpoint = useCurrentEndpoint();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const handleNewRequest = useCallback(
    (newRequest: RequestLog) => {
      if (page !== 1) return;

      setRequests((prev) => [newRequest, ...prev.slice(0, 19)]);
    },
    [page],
  );

  useLiveRequests(endpoint?.slug, handleNewRequest);

  useEffect(() => {
    if (!endpointId) return;

    const fetchRequests = async () => {
      try {
        const data = await getRequests(endpointId, page);

        setRequests(data.requests);

        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, [endpointId, page]);

  const filteredRequests = requests.filter((request) => {
    const query = search.toLowerCase();

    const matchesSearch =
      request.method.toLowerCase().includes(query) ||
      request.ip.toLowerCase().includes(query) ||
      request.userAgent.toLowerCase().includes(query) ||
      request.contentType?.toLowerCase().includes(query) ||
      JSON.stringify(request.body ?? {})
        .toLowerCase()
        .includes(query);

    const matchesMethod =
      methodFilter === "ALL" || request.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_BASE_URL}/h/${endpoint?.slug}`;

  if (requests.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-border-default p-6">
          <h2 className="text-xl font-semibold">No requests received yet</h2>

          <p className="mt-2 text-text-secondary">
            Send a webhook request to your endpoint URL below.
          </p>
        </div>

        <div className="rounded-lg border border-border-default p-6">
          <h3 className="mb-3 font-medium">Webhook URL</h3>

          <div className="flex gap-3">
            <code className="flex-1 overflow-auto rounded-lg bg-background p-3 text-sm">
              {webhookUrl}
            </code>

            <CopyButton content={webhookUrl} />
          </div>
        </div>

        <div className="rounded-lg border border-border-default p-6">
          <h3 className="mb-3 font-medium">Example cURL Request</h3>

          <pre className="overflow-auto rounded-lg bg-background p-4 text-sm">
            {`curl -X POST ${webhookUrl} \\
-H "Content-Type: application/json" \\
-d '{"event":"test"}'`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search requests (method, IP, path...)"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <LayoutGroup id="method-filter">
          <div className="flex flex-wrap items-center gap-1 rounded-md border border-border-default bg-bg-card p-1">
            {methods.map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                className="relative rounded-md px-3.5 cursor-pointer py-1.5 text-sm font-medium"
              >
                {methodFilter === method && (
                  <motion.div
                    layoutId="method-filter-pill"
                    className="absolute inset-0 rounded-[5px] bg-blue-600 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    methodFilter === method
                      ? "text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {method}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      {requests.length === 0 && endpoint ? (
        <EndpointEmptyState endpointId={endpoint._id} slug={endpoint.slug} />
      ) : (
        filteredRequests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))
      )}
      {/* Pagination */}
      <Pagination pagination={pagination} setPage={setPage} />
    </div>
  );
}

export default EndpointRequests;

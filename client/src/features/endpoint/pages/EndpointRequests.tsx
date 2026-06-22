import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EndpointEmptyState from "../components/EndpointEmptyState";
import { getRequests } from "@/features/request/api/getRequests";
import type { RequestLog } from "@/features/request/types/request.types";
import RequestCard from "@/features/request/components/RequestCard";
import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { useLiveRequests } from "@/features/request/hook/useLiveRequests";

const methods = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

function EndpointRequests() {
  const { endpointId } = useParams();

  const endpoint = useCurrentEndpoint();

  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const handleNewRequest = useCallback((newRequest: RequestLog) => {
    setRequests((prev) => [newRequest, ...prev]);
  }, []);

  useLiveRequests(endpoint?.slug, handleNewRequest);

  useEffect(() => {
    if (!endpointId) return;

    const fetchRequests = async () => {
      try {
        const data = await getRequests(endpointId);

        setRequests(data.requests);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, [endpointId]);

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

  const webhookUrl = `${import.meta.env.VITE_API_BASE_URL}/h/${endpoint?.slug}`;

  const handleCopyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
    } catch (error) {
      console.error(error);
    }
  };

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

            <button
              onClick={handleCopyWebhook}
              className="rounded-lg border border-border-default px-4 py-2"
            >
              Copy
            </button>
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
      <input
        type="text"
        placeholder="Search requests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border-default px-4 py-2"
      />

      <div className="flex flex-wrap gap-2">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => setMethodFilter(method)}
            className={`rounded-lg px-3 py-1 text-sm ${
              methodFilter === method
                ? "bg-primary text-text-primary"
                : "border border-border-default"
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      {requests.length === 0 && endpoint ? (
        <EndpointEmptyState endpointId={endpoint._id} slug={endpoint.slug} />
      ) : (
        filteredRequests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))
      )}
    </div>
  );
}

export default EndpointRequests;

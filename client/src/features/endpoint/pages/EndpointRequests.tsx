import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequests } from "@/features/request/api/getRequests";
import type { RequestLog } from "@/features/request/types/request.types";
import RequestCard from "@/features/request/components/RequestCard";
import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { useLiveRequests } from "@/features/request/hook/useLiveRequests";

function EndpointRequests() {
  const { endpointId } = useParams();
  const endpoint = useCurrentEndpoint();
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [search, setSearch] = useState("");
  const handleNewRequest = useCallback((newRequest: RequestLog) => {
    setRequests((prev) => [newRequest, ...prev]);
  }, []);

  useLiveRequests(endpoint?.slug, handleNewRequest);
  useEffect(() => {
    if (!endpointId) return;

    const fetchRequests = async () => {
      const data = await getRequests(endpointId);

      setRequests(data.requests);
    };

    fetchRequests();
  }, [endpointId]);

  const filteredRequests = requests.filter((request) => {
    const query = search.toLowerCase();

    return (
      request.method.toLowerCase().includes(query) ||
      request.ip.toLowerCase().includes(query) ||
      request.userAgent.toLowerCase().includes(query) ||
      request.contentType?.toLowerCase().includes(query) ||
      JSON.stringify(request.body).toLowerCase().includes(query)
    );
  });
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search requests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border-default px-4 py-2"
      />
      {filteredRequests.map((request) => (
        <RequestCard key={request._id} request={request} />
      ))}
    </div>
  );
}

export default EndpointRequests;

import { useEffect, useState } from "react";
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

  useLiveRequests(endpoint?.slug);
  useEffect(() => {
    if (!endpointId) return;

    const fetchRequests = async () => {
      const data = await getRequests(endpointId);

      setRequests(data.requests);
    };

    fetchRequests();
  }, [endpointId]);

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request._id} request={request} />
      ))}
    </div>
  );
}

export default EndpointRequests;

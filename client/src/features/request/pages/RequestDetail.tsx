import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "@/features/request/api/getRequest";
import type { RequestLog } from "../types/request.types";

function RequestDetail() {
  const { requestId } = useParams();

  const [request, setRequest] = useState<RequestLog | null>(null);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      const data = await getRequest(requestId);

      setRequest(data);
    };

    fetchRequest();
  }, [requestId]);

  return <pre>{JSON.stringify(request, null, 2)}</pre>;
}

export default RequestDetail;

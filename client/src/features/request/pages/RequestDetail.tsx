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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{request?.method}</h1>

        <p>{request?.ip}</p>
      </div>

      <section>
        <h2>Headers</h2>

        <pre>{JSON.stringify(request?.headers, null, 2)}</pre>
      </section>

      <section>
        <h2>Body</h2>

        <pre>{JSON.stringify(request?.body, null, 2)}</pre>
      </section>

      <section>
        <h2>Query</h2>

        <pre>{JSON.stringify(request?.query, null, 2)}</pre>
      </section>
    </div>
  );
}

export default RequestDetail;

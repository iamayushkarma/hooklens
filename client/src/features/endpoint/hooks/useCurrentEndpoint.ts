import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getEndpoints } from "../api/getEndpoints";
import type { Endpoint } from "../types/endpoint.types";

export function useCurrentEndpoint() {
  const { projectId, endpointId } = useParams();

  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);

  useEffect(() => {
    if (!projectId || !endpointId) return;

    const loadEndpoint = async () => {
      const endpoints = await getEndpoints(projectId);

      const found = endpoints.find((endpoint) => endpoint._id === endpointId);

      setEndpoint(found ?? null);
    };

    loadEndpoint();
  }, [projectId, endpointId]);

  return endpoint;
}

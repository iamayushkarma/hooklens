import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEndpoints } from "../api/getEndpoints";
import type { Endpoint as EndpointType } from "../types/endpoint.types";

function Endpoint() {
  const { projectId } = useParams();

  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);

  useEffect(() => {
    if (!projectId) return;

    const fetchEndpoints = async () => {
      const data = await getEndpoints(projectId);

      setEndpoints(data);
    };

    fetchEndpoints();
  }, [projectId]);

  return (
    <div>
      <pre>{JSON.stringify(endpoints, null, 2)}</pre>
    </div>
  );
}

export default Endpoint;

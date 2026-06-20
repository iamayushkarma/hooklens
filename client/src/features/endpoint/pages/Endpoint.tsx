import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEndpoints } from "../api/getEndpoints";
import type { Endpoint as EndpointType } from "../types/endpoint.types";
import EndpointCard from "../components/EndpointCard";

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
      {/* <pre>{JSON.stringify(endpoints, null, 2)}</pre> */}
      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <EndpointCard key={endpoint._id} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}

export default Endpoint;

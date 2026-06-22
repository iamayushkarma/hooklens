import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEndpoint from "../components/CreateEndpoint";
import CreateEndpointBtn from "../components/CreateEndpointBtn";
import { getEndpoints } from "../api/getEndpoints";
import type { Endpoint as EndpointType } from "../types/endpoint.types";
import EndpointCard from "../components/EndpointCard";

function Endpoint() {
  const { projectId } = useParams();
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const [showCreateEndpoint, setShowCreateEndpoint] = useState(false);
  useEffect(() => {
    if (!projectId) return;

    const fetchEndpoints = async () => {
      const data = await getEndpoints(projectId);

      setEndpoints(data);
    };

    fetchEndpoints();
  }, [projectId]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Endpoints</h2>

          <p className="text-sm text-text-secondary">
            Inspect and monitor incoming webhook requests.
          </p>
        </div>

        <CreateEndpointBtn onClick={() => setShowCreateEndpoint(true)} />
      </div>

      <CreateEndpoint
        isOpen={showCreateEndpoint}
        onClose={() => setShowCreateEndpoint(false)}
      />

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <EndpointCard key={endpoint._id} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}

export default Endpoint;

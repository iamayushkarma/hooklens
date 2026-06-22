import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEndpoint from "../components/CreateEndpoint";
import CreateEndpointBtn from "../components/CreateEndpointBtn";
import { getEndpoints } from "../api/getEndpoints";
import type { Endpoint as EndpointType } from "../types/endpoint.types";
import EndpointCard from "../components/EndpointCard";

function Endpoint() {
  const { projectId } = useParams();
  const [showCreate, setShowCreate] = useState(false);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Endpoints</h2>

        <CreateEndpointBtn onClick={() => setShowCreate(true)} />
      </div>

      {showCreate && <CreateEndpoint onClose={() => setShowCreate(false)} />}

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <EndpointCard key={endpoint._id} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}

export default Endpoint;

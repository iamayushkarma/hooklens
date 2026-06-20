import { Outlet } from "react-router-dom";
import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";

function EndpointLayout() {
  const endpoint = useCurrentEndpoint();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{endpoint?.label}</h1>

        <p className="text-text-secondary">/{endpoint?.slug}</p>
      </div>

      <Outlet />
    </div>
  );
}

export default EndpointLayout;

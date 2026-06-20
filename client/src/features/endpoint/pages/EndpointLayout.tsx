import { Outlet } from "react-router-dom";

function EndpointLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Endpoint</h1>

      <Outlet />
    </div>
  );
}

export default EndpointLayout;

import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;

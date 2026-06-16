// import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
// import { useAuthStore } from "@/store/auth.store";
// import { AnalyticsChart } from "./components/AnalyticsChart";
// import { getWorkspaces } from "@/features/analytics/api/getWorkspaces";

// function Dashboard() {
//   const user = useAuthStore((state) => state.user);
//   console.log("user", user);

//   // const { Analytics } = getWorkspaceAnalytics;

//   return (
//     <>
//       <h1>Dashboard Home</h1>
//       <ThemeSwitcher />
//       {/* <AnalyticsChart data={Analytics.data.dailyTimeline} /> */}
//     </>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";

import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { getWorkspaces } from "@/features/analytics/api/getWorkspaces";
import { getWorkspaceAnalytics } from "../analytics/api/getWorkspaceAnalytics";

function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Get user's workspaces
        const workspaces = await getWorkspaces();

        if (!workspaces.length) return;

        const workspaceId = workspaces[0]._id;

        // Get analytics
        const analyticsData = await getWorkspaceAnalytics(workspaceId);

        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(analytics);
  return (
    <>
      <h1>Dashboard Home</h1>

      <ThemeSwitcher />

      <div className="mt-5">
        <AnalyticsChart data={analytics?.dailyTimeline ?? []} />
      </div>
    </>
  );
}

export default Dashboard;

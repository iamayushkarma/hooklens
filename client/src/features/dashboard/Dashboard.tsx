import { useEffect, useState } from "react";

import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { getWorkspaces } from "@/features/workspace/api/getWorkspaces";
import { getWorkspaceAnalytics } from "../analytics/api/getWorkspaceAnalytics";
import { ChevronDown } from "lucide-react";

function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [openRangeMenu, setOpenRangeMenue] = useState<boolean>(false);

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

  const toggleRangeMenu = () => {
    setOpenRangeMenue((prev) => !prev);
  };
  const filteredData =
    analytics?.dailyTimeline?.filter((item: any) => {
      const date = new Date(item.date);

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - timeRange);

      return date >= cutoff;
    }) ?? [];

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(analytics);
  return (
    <>
      <h1>Dashboard Home</h1>

      <ThemeSwitcher />
      <div className="mt-5 border bg-bg-card border-border-default rounded-lg py-2 px-4">
        <div className="py-6 px-2 flex items-center justify-between">
          {/* heading and sub heading */}
          <div>
            <h2 className="font-semibold text-[1.2rem] text-text-primary">
              Request Analytics
            </h2>
            <p className="text-text-secondary text-[.85rem]">
              Showing webhook activity for the last {timeRange} days
            </p>
          </div>
          {/* Rang selector */}
          <div
            onClick={toggleRangeMenu}
            className="px-3 relative py-2 cursor-pointer rounded-md shadow-2xs bg-bg-sidebar flex items-center justify-between gap-5"
          >
            <span className="text-[.85rem]">Last {timeRange} day's</span>
            <ChevronDown className="size-4" />

            {openRangeMenu && (
              <div className="top-11 w-full left-0 absolute p-1.5 z-[99999]  cursor-pointer rounded-md shadow-2xs bg-bg-sidebar text-[.85rem]">
                <button
                  className="cursor-pointer py-1.5 hover:bg-base-hover w-full px-2 rounded-md flex items-start"
                  onClick={() => setTimeRange(7)}
                >
                  Last 7 day's
                </button>
                <button
                  className="cursor-pointer py-1.5 hover:bg-base-hover w-full px-2 rounded-md flex items-start"
                  onClick={() => setTimeRange(30)}
                >
                  Last 30 day's
                </button>
                <button
                  className="cursor-pointer py-1.5 hover:bg-base-hover w-full px-2 rounded-md flex items-start"
                  onClick={() => setTimeRange(90)}
                >
                  Last 90 day's
                </button>
              </div>
            )}
          </div>
        </div>
        {/* User Request Graph */}
        <AnalyticsChart data={filteredData} />
      </div>
    </>
  );
}

export default Dashboard;

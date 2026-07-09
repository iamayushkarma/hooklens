import { useEffect, useState } from "react";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { StatsRow } from "./components/StatsRow";
import { MethodPieChart } from "./components/MethodPieChart";
import { TopEndpointsTable } from "./components/TopEndpointsTable";
import { getWorkspaces } from "@/features/workspace/api/getWorkspaces";
import { getWorkspaceAnalytics } from "../analytics/api/getWorkspaceAnalytics";
import type { WorkspaceAnalytics } from "@/features/analytics/types/analytics.types";
import { ChevronDown } from "lucide-react";
import { BentoSection } from "./components/BentoSection";

function Dashboard() {
  const [analytics, setAnalytics] = useState<WorkspaceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [hasWorkspace, setHasWorkspace] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [openRangeMenu, setOpenRangeMenu] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const workspacesData = await getWorkspaces();
        setWorkspaces(workspacesData);
        if (!workspacesData.length) {
          setHasWorkspace(false);
          return;
        }
        const workspaceId = workspacesData[0]._id;
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

  const toggleRangeMenu = () => setOpenRangeMenu((prev) => !prev);

  const filteredData =
    analytics?.dailyTimeline?.filter((item) => {
      const date = new Date(item.date);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - timeRange);
      return date >= cutoff;
    }) ?? [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasWorkspace) {
    return (
      <div className="mt-10 text-center text-text-secondary">
        You don't have a workspace yet. Create one to see analytics.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[1.4rem] font-semibold text-text-primary">
        Dashboard Home
      </h1>

      {/* Stat cards */}
      <StatsRow analytics={analytics} />

      {/* 60/40 chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 border bg-bg-card border-border-default rounded-lg py-2 px-4">
          <div className="py-6 px-2 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[1.2rem] text-text-primary">
                Request Analytics
              </h2>
              <p className="text-text-secondary text-[.85rem]">
                Showing webhook activity for the last {timeRange} days
              </p>
            </div>
            <div
              onClick={toggleRangeMenu}
              className="px-3 relative py-2 cursor-pointer rounded-md shadow-2xs bg-bg-sidebar flex items-center justify-between gap-5"
            >
              <span className="text-[.85rem]">Last {timeRange} day's</span>
              <ChevronDown className="size-4" />

              {openRangeMenu && (
                <div className="top-11 w-full left-0 absolute p-1.5 z-[99999] cursor-pointer rounded-md shadow-2xs bg-bg-sidebar text-[.85rem]">
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
          <AnalyticsChart data={filteredData} />
        </div>

        <div className="lg:col-span-2 border bg-bg-card border-border-default rounded-lg py-2 px-4">
          <div className="py-6 px-2">
            <h2 className="font-semibold text-[1.2rem] text-text-primary">
              Requests by Method
            </h2>
            <p className="text-text-secondary text-[.85rem]">
              Breakdown of HTTP methods, last 60 days
            </p>
          </div>
          <MethodPieChart data={analytics?.methodBreakdown ?? []} />
        </div>
      </div>
      <BentoSection
        topEndpoints={analytics?.topEndpoints ?? []}
        workspaces={workspaces}
        recentActivity={[]} // wire once the live-feed source is confirmed
        activeWorkspaceId={workspaces[0]?._id ?? ""}
      />
      {/* Top endpoints */}
      <div className="border bg-bg-card border-border-default rounded-lg py-2 px-4">
        <div className="py-6 px-2">
          <h2 className="font-semibold text-[1.2rem] text-text-primary">
            Top Endpoints
          </h2>
          <p className="text-text-secondary text-[.85rem]">
            Most active endpoints by request volume
          </p>
        </div>
        <div className="pb-4 px-2">
          <TopEndpointsTable
            data={analytics?.topEndpoints ?? []}
            workspaceId={workspaces[0]?._id ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { Activity, Zap, Server, GitBranch } from "lucide-react";
import { StatCard } from "./StatCard";
import type { WorkspaceAnalytics } from "@/features/analytics/types/analytics.types";

interface StatsRowProps {
  analytics: WorkspaceAnalytics | null;
}

export function StatsRow({ analytics }: StatsRowProps) {
  if (!analytics) return null;

  const {
    totalThisWeek,
    requestsToday,
    requestsDeltaPct,
    activeEndpointCount,
    methodBreakdown,
    dailyTimeline,
  } = analytics;

  // sparkline for total requests: last 7 days from dailyTimeline
  const weekSparkline = dailyTimeline
    .slice(-7)
    .map((d) => ({ value: d.count }));

  // top method + its share of total
  const totalMethodCount = methodBreakdown.reduce((sum, m) => sum + m.count, 0);
  const topMethod = methodBreakdown[0];
  const topMethodPct =
    topMethod && totalMethodCount
      ? Math.round((topMethod.count / totalMethodCount) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Requests This Week"
        value={totalThisWeek}
        icon={<Activity className="size-4" />}
        sparklineData={weekSparkline}
      />
      <StatCard
        label="Requests Today"
        value={requestsToday}
        deltaPct={requestsDeltaPct}
        icon={<Zap className="size-4" />}
      />
      <StatCard
        label="Active Endpoints"
        value={activeEndpointCount}
        icon={<Server className="size-4" />}
      />
      <StatCard
        label="Top Method"
        value={topMethod ? `${topMethod.method} · ${topMethodPct}%` : "—"}
        icon={<GitBranch className="size-4" />}
      />
    </div>
  );
}

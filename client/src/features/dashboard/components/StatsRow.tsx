import { StatCard } from "./StatCard";
import { ActiveEndpointsBar } from "./ActiveEndpointsBar";
import type { WorkspaceAnalytics } from "@/features/analytics/types/analytics.types";

interface StatsRowProps {
  analytics: WorkspaceAnalytics | null;
}

export function StatsRow({ analytics }: StatsRowProps) {
  if (!analytics) return null;

  const {
    requestsToday,
    requestsYesterday,
    requestsDeltaPct,
    totalThisWeek,
    totalLastWeek,
    activeEndpointCount,
    totalEndpointCount,
    replaysLast30Days,
    replaysDeltaPct,
    dailyTimeline,
  } = analytics;

  const weekSparkline = dailyTimeline
    .slice(-7)
    .map((d) => ({ value: d.count }));
  const weekDeltaPct =
    totalLastWeek === 0
      ? null
      : Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Requests today"
        value={requestsToday.toLocaleString()}
        deltaPct={requestsDeltaPct}
        caption={`from ${requestsYesterday.toLocaleString()} yesterday`}
        sparklineData={weekSparkline}
        accent="emerald"
      />
      <StatCard
        label="This week"
        value={totalThisWeek.toLocaleString()}
        deltaPct={weekDeltaPct}
        caption={`from ${totalLastWeek.toLocaleString()} last week`}
        sparklineData={weekSparkline}
        accent="blue"
      />
      <StatCard
        label="Active endpoints"
        value={activeEndpointCount}
        caption={`${totalEndpointCount - activeEndpointCount} inactive`}
        rightSlot={
          <ActiveEndpointsBar
            active={activeEndpointCount}
            total={totalEndpointCount}
          />
        }
      />
      <StatCard
        label="Replays run"
        value={replaysLast30Days}
        deltaPct={replaysDeltaPct}
        caption="from last 30 days"
        sparklineData={weekSparkline}
        accent="rose"
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Activity,
  CalendarClock,
  GitBranch,
  Radio,
  TrendingUp,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { getEndpointAnalytics } from "@/features/analytics/api/getEndpointAnalytics";
import AnalyticsChart from "@/features/endpoint/components/AnalyticsChart";
import type { EndpointAnalytics } from "../types/endpoint.types";

// recharts sets fill/stroke as raw SVG attributes, so Tailwind classes
// won't apply here — reference the same CSS custom properties directly.
const METHOD_COLOR_VAR: Record<string, string> = {
  GET: "var(--color-get-text)",
  POST: "var(--color-post-text)",
  PUT: "var(--color-put-text)",
  PATCH: "var(--color-patch-text)",
  DELETE: "var(--color-delete-text)",
};

function methodColorVar(method: string) {
  return (
    METHOD_COLOR_VAR[method?.toUpperCase()] ?? "var(--color-text-secondary)"
  );
}

function MethodRadarDot({ cx, cy, payload }: any) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={methodColorVar(payload.method)}
      stroke="var(--color-bg-card)"
      strokeWidth={1.5}
    />
  );
}

function MethodRadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-border-default bg-bg-card px-3 py-2 shadow-md">
      <p
        className="font-mono text-xs font-semibold"
        style={{ color: methodColorVar(point.method) }}
      >
        {point.method}
      </p>
      <p className="mt-0.5 text-xs text-text-secondary tabular-nums">
        {point.count.toLocaleString()} requests · {point.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  accent?: "success" | "danger";
}) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="size-3.5 text-accent" strokeWidth={2.25} />
        </span>
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </p>
      </div>

      <p
        className={`mt-3 text-3xl font-semibold tabular-nums tracking-tight ${
          accent === "success"
            ? "text-success"
            : accent === "danger"
              ? "text-danger"
              : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-card p-5"
          >
            <div className="h-7 w-7 animate-pulse rounded-md bg-base-hover" />
            <div className="mt-4 h-3 w-20 animate-pulse rounded bg-base-hover" />
            <div className="mt-3 h-7 w-16 animate-pulse rounded bg-base-hover" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-64 animate-pulse rounded-xl border border-border-default bg-bg-card lg:col-span-3" />
        <div className="h-64 animate-pulse rounded-xl border border-border-default bg-bg-card lg:col-span-2" />
      </div>
    </div>
  );
}

export function EndpointAnalytics() {
  const { endpointId } = useParams();

  const [analytics, setAnalytics] = useState<EndpointAnalytics | null>(null);

  useEffect(() => {
    if (!endpointId) return;

    const fetchAnalytics = async () => {
      try {
        const data = await getEndpointAnalytics(endpointId);

        setAnalytics(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnalytics();
  }, [endpointId]);

  if (!analytics) {
    return <LoadingState />;
  }

  const isLive = analytics.endpoint.isActive;

  const radarData = analytics.methodBreakdown.map((item: any) => ({
    method: item.method,
    count: item.count,
    percentage:
      analytics.totalRequests > 0
        ? (item.count / analytics.totalRequests) * 100
        : 0,
  }));

  const topMethod = radarData.reduce(
    (max: any, item: any) => (item.count > (max?.count ?? -1) ? item : max),
    null,
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Activity}
          label="Total Requests"
          value={analytics.totalRequests.toLocaleString()}
        />

        <KpiCard
          icon={CalendarClock}
          label="Requests Today"
          value={analytics.requestsToday.toLocaleString()}
        />

        <KpiCard
          icon={GitBranch}
          label="Methods Used"
          value={analytics.methodBreakdown.length}
        />

        <KpiCard
          icon={Radio}
          label="Endpoint Status"
          value={
            <span className="inline-flex items-center gap-2">
              {isLive && (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
              )}
              <span className="text-2xl"> {isLive ? "Live" : "Disabled"}</span>
            </span>
          }
          accent={isLive ? "success" : "danger"}
        />
      </div>

      {/* Traffic Chart + Method Breakdown */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm lg:col-span-3">
          <h2 className="mb-1 text-sm font-semibold text-text-primary">
            Traffic over time
          </h2>
          <p className="mb-4 text-xs text-text-secondary">
            Hourly request volume for this endpoint
          </p>
          <AnalyticsChart data={analytics.hourlyTimeline} />
        </div>

        <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-1 text-sm font-semibold text-text-primary">
            Method breakdown
          </h2>
          <p className="mb-2 text-xs text-text-secondary">
            Share of traffic per HTTP method
          </p>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="var(--color-border-default)" />
                <PolarAngleAxis
                  dataKey="method"
                  tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
                />
                <Tooltip content={<MethodRadarTooltip />} cursor={false} />
                <Radar
                  dataKey="count"
                  stroke="var(--color-accent)"
                  fill="var(--color-accent)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={<MethodRadarDot />}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {topMethod && (
            <div className="mt-3 flex items-center gap-1.5 border-t border-border-subtle pt-3 text-xs">
              <TrendingUp
                className="size-3.5"
                style={{ color: methodColorVar(topMethod.method) }}
              />
              <span className="text-text-primary">
                <span className="font-mono font-semibold">
                  {topMethod.method}
                </span>{" "}
                leads with {topMethod.percentage.toFixed(1)}% of requests
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

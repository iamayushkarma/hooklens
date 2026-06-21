import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEndpointAnalytics } from "@/features/analytics/api/getEndpointAnalytics";
import AnalyticsChart from "@/features/endpoint/components/AnalyticsChart";
import type { EndpointAnalytics } from "../types/endpoint.types";

function EndpointAnalytics() {
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
    return (
      <div className="rounded-lg border border-border-default p-6">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border-default p-4">
          <p className="text-sm text-text-secondary">Total Requests</p>

          <p className="mt-2 text-3xl font-semibold">
            {analytics.totalRequests}
          </p>
        </div>

        <div className="rounded-lg border border-border-default p-4">
          <p className="text-sm text-text-secondary">Requests Today</p>

          <p className="mt-2 text-3xl font-semibold">
            {analytics.requestsToday}
          </p>
        </div>

        <div className="rounded-lg border border-border-default p-4">
          <p className="text-sm text-text-secondary">Methods Used</p>

          <p className="mt-2 text-3xl font-semibold">
            {analytics.methodBreakdown.length}
          </p>
        </div>

        <div className="rounded-lg border border-border-default p-4">
          <p className="text-sm text-text-secondary">Endpoint Status</p>

          <p
            className={`mt-2 text-3xl font-semibold ${
              analytics.endpoint.isActive ? "text-green-500" : "text-red-500"
            }`}
          >
            {analytics.endpoint.isActive ? "Live" : "Disabled"}
          </p>
        </div>
      </div>

      {/* Traffic Chart */}
      <AnalyticsChart data={analytics.hourlyTimeline} />

      {/* Method Breakdown */}
      <div className="rounded-lg border border-border-default p-5">
        <h2 className="mb-5 text-lg font-semibold">Method Breakdown</h2>

        <div className="space-y-4">
          {analytics.methodBreakdown.map((item: any) => {
            const percentage =
              analytics.totalRequests > 0
                ? (item.count / analytics.totalRequests) * 100
                : 0;

            return (
              <div key={item.method}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{item.method}</span>

                  <span className="text-sm text-text-secondary">
                    {item.count}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-border-default">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="mt-1 text-right text-xs text-text-secondary">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EndpointAnalytics;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEndpointAnalytics } from "@/features/analytics/api/getEndpointAnalytics";

function EndpointAnalytics() {
  const { endpointId } = useParams();

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!endpointId) return;

    const fetchAnalytics = async () => {
      const data = await getEndpointAnalytics(endpointId);

      console.log(data);

      setAnalytics(data);
    };

    fetchAnalytics();
  }, [endpointId]);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border-default p-4">
          <p className="text-sm text-text-secondary">Total Requests</p>

          <p className="text-3xl font-semibold">{analytics.totalRequests}</p>
        </div>

        <div className="rounded-lg border border-border-default p-4">
          <p className="text-sm text-text-secondary">Requests Today</p>

          <p className="text-3xl font-semibold">{analytics.requestsToday}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border-default p-4">
        <h2 className="mb-4 text-lg font-semibold">Method Breakdown</h2>

        <div className="space-y-3">
          {analytics.methodBreakdown.map((item: any) => (
            <div
              key={item.method}
              className="flex items-center justify-between"
            >
              <span>{item.method}</span>

              <span>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EndpointAnalytics;

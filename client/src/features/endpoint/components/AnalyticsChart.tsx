import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface AnalyticsChartProps {
  data: {
    hour: string;
    count: number;
  }[];
}

function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="rounded-lg border border-border-default p-5">
      <h2 className="mb-4 text-lg font-semibold">Requests Activity</h2>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="hour" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line type="monotone" dataKey="count" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsChart;

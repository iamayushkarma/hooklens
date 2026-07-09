import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { MethodBreakdown } from "@/features/analytics/types/analytics.types";

interface MethodPieChartProps {
  data: MethodBreakdown[];
}

const COLORS = [
  "var(--chart-1, #6366f1)",
  "var(--chart-2, #22c55e)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #06b6d4)",
];

export function MethodPieChart({ data }: MethodPieChartProps) {
  const chartConfig: ChartConfig = data.reduce((config, item, i) => {
    config[item.method] = {
      label: item.method,
      color: COLORS[i % COLORS.length],
    };
    return config;
  }, {} as ChartConfig);

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary text-[.85rem]">
        No requests yet
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[260px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="method"
          innerRadius={55}
          outerRadius={90}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.method} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="method" />} />
      </PieChart>
    </ChartContainer>
  );
}

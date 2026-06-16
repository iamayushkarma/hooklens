import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  data: {
    date: string;
    count: number;
  }[];
};

const chartConfig = {
  count: {
    label: "Requests",
  },
};

export function AnalyticsChart({ data }: Props) {
  console.log(data);
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Area
          dataKey="count"
          type="monotone"
          fill="currentColor"
          fillOpacity={0.15}
          stroke="currentColor"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

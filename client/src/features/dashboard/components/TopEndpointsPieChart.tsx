import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Endpoint = {
  label: string;
  requestCount: number;
};

interface Props {
  data: Endpoint[];
}
function TopEndpointsPieChart({ data }: Props) {
  const chartConfig = {
    requests: {
      label: "Requests",
    },
    endpoint1: {
      color: "#2633cb",
    },
    endpoint2: {
      color: "#4250e8",
    },
    endpoint3: {
      color: "#5d6bff",
    },
    endpoint4: {
      color: "#7a86ff",
    },
    endpoint5: {
      color: "#a1aaff",
    },
  } satisfies ChartConfig;
  const colors = ["#2633cb", "#4250e8", "#5d6bff", "#7a86ff", "#a1aaff"];

  const chartData =
    data?.slice(0, 5).map((endpoint, index) => ({
      endpoint: endpoint.label,
      requests: endpoint.requestCount,
      fill: colors[index],
    })) ?? [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Distribution</CardTitle>

        <CardDescription>Top endpoints by request volume</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Pie data={chartData} dataKey="requests" nameKey="endpoint" />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Endpoint traffic share
        </div>
      </CardFooter>
    </Card>
  );
}

export default TopEndpointsPieChart;

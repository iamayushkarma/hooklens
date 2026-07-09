import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface StatCardProps {
  label: string;
  value: string | number;
  deltaPct?: number | null;
  icon?: ReactNode;
  sparklineData?: { value: number }[];
}

export function StatCard({
  label,
  value,
  deltaPct,
  icon,
  sparklineData,
}: StatCardProps) {
  const isPositive = (deltaPct ?? 0) >= 0;

  return (
    <div className="border bg-bg-card border-border-default rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-[.8rem]">{label}</p>
          <p className="text-text-primary text-[1.6rem] font-semibold mt-1">
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-text-secondary bg-bg-sidebar rounded-md p-2">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mt-3">
        {deltaPct !== null && deltaPct !== undefined ? (
          <span
            className={`flex items-center gap-1 text-[.75rem] font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            {Math.abs(deltaPct)}%
          </span>
        ) : (
          <span className="text-[.75rem] text-text-secondary">—</span>
        )}

        {sparklineData && sparklineData.length > 1 && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

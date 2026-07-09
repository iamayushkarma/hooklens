// import type { ReactNode } from "react";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import { ResponsiveContainer, LineChart, Line } from "recharts";

// interface StatCardProps {
//   label: string;
//   value: string | number;
//   deltaPct?: number | null;
//   icon?: ReactNode;
//   sparklineData?: { value: number }[];
// }

// export function StatCard({
//   label,
//   value,
//   deltaPct,
//   icon,
//   sparklineData,
// }: StatCardProps) {
//   const isPositive = (deltaPct ?? 0) >= 0;

//   return (
//     <div className="border bg-bg-card border-border-default rounded-lg p-4 flex flex-col justify-between">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-text-secondary text-[.8rem]">{label}</p>
//           <p className="text-text-primary text-[1.6rem] font-semibold mt-1">
//             {value}
//           </p>
//         </div>
//         {icon && (
//           <div className="text-text-secondary bg-bg-sidebar rounded-md p-2">
//             {icon}
//           </div>
//         )}
//       </div>

//       <div className="flex items-end justify-between mt-3">
//         {deltaPct !== null && deltaPct !== undefined ? (
//           <span
//             className={`flex items-center gap-1 text-[.75rem] font-medium ${
//               isPositive ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {isPositive ? (
//               <ArrowUp className="size-3" />
//             ) : (
//               <ArrowDown className="size-3" />
//             )}
//             {Math.abs(deltaPct)}%
//           </span>
//         ) : (
//           <span className="text-[.75rem] text-text-secondary">—</span>
//         )}

//         {sparklineData && sparklineData.length > 1 && (
//           <div className="w-16 h-8">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={sparklineData}>
//                 <Line
//                   type="monotone"
//                   dataKey="value"
//                   stroke={isPositive ? "#22c55e" : "#ef4444"}
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface StatCardProps {
  label: string;
  value: string | number;
  deltaPct?: number | null;
  caption: string;
  sparklineData?: { value: number }[];
  accent?: "emerald" | "blue" | "rose" | "violet";
  rightSlot?: ReactNode; // for the active-endpoints bar visualization
}

const ACCENT_STROKE: Record<string, string> = {
  emerald: "#10b981",
  blue: "#3b82f6",
  rose: "#f43f5e",
  violet: "#8b5cf6",
};

export function StatCard({
  label,
  value,
  deltaPct,
  caption,
  sparklineData,
  accent = "emerald",
  rightSlot,
}: StatCardProps) {
  const isPositive = (deltaPct ?? 0) >= 0;
  const badgeColor = isPositive
    ? "bg-emerald-50 text-emerald-600"
    : "bg-rose-50 text-rose-600";

  return (
    <div className="border bg-bg-card border-border-default rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-text-secondary text-[.82rem]">{label}</p>
        {deltaPct !== null && deltaPct !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-[.72rem] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}
          >
            {isPositive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(deltaPct)}%
          </span>
        )}
      </div>

      <p className="text-text-primary text-[1.8rem] font-semibold leading-none">
        {value}
      </p>

      {rightSlot ? (
        rightSlot
      ) : sparklineData && sparklineData.length > 1 ? (
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient
                  id={`spark-${accent}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={ACCENT_STROKE[accent]}
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor={ACCENT_STROKE[accent]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={ACCENT_STROKE[accent]}
                strokeWidth={2}
                fill={`url(#spark-${accent})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-10" />
      )}

      <p className="text-text-secondary text-[.75rem]">{caption}</p>
    </div>
  );
}

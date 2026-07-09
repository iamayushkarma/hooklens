import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"; // swap for your formateDate.ts if it covers relative time

interface ActivityItem {
  _id: string;
  method: string;
  endpointSlug: string;
  createdAt: string;
}

interface RecentActivityFeedProps {
  items: ActivityItem[];
}

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-blue-500",
  POST: "bg-emerald-500",
  PUT: "bg-amber-500",
  PATCH: "bg-amber-500",
  DELETE: "bg-rose-500",
};

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
  const [, forceTick] = useState(0);

  // re-render every 15s so "Xs ago" labels stay fresh without a full refetch
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 15000);
    return () => clearInterval(id);
  }, []);

  if (!items.length) {
    return (
      <div className="py-6 text-center text-text-secondary text-[.85rem]">
        No recent activity
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.slice(0, 5).map((item) => (
        <div key={item._id} className="flex items-center gap-2.5">
          <span
            className={`size-1.5 rounded-full shrink-0 ${
              METHOD_COLOR[item.method] ?? "bg-text-secondary"
            }`}
          />
          <div className="min-w-0 flex-1">
            <p className="text-text-primary text-[.82rem] truncate">
              {item.method} /{item.endpointSlug}
            </p>
            <p className="text-text-secondary text-[.72rem]">
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

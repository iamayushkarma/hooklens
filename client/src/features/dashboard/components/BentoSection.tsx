import { TopEndpointsTable } from "./TopEndpointsTable";
import { WorkspacesList } from "./WorkspacesList";
import { RecentActivityFeed } from "./RecentActivityFeed";
import type { TopEndpoint } from "@/features/analytics/types/analytics.types";

interface Workspace {
  _id: string;
  name: string;
  yourRole: string;
  projectCount: number;
  memberCount: number;
}

interface ActivityItem {
  _id: string;
  method: string;
  endpointSlug: string;
  createdAt: string;
}

interface BentoSectionProps {
  topEndpoints: TopEndpoint[];
  workspaces: Workspace[];
  recentActivity: ActivityItem[];
  activeWorkspaceId: string;
}

export function BentoSection({
  topEndpoints,
  workspaces,
  recentActivity,
  activeWorkspaceId,
}: BentoSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Top endpoints — tall, spans 2 cols + 2 rows */}
      <div className="lg:col-span-2 lg:row-span-2 border bg-bg-card border-border-default rounded-2xl p-5">
        <h3 className="text-text-primary text-[1.05rem] font-semibold mb-4">
          Top endpoints
        </h3>
        <TopEndpointsTable
          data={topEndpoints}
          workspaceId={activeWorkspaceId}
        />
      </div>

      {/* Workspaces */}
      <div className="border bg-bg-card border-border-default rounded-2xl p-5">
        <h3 className="text-text-primary text-[1.05rem] font-semibold mb-4">
          Your workspaces
        </h3>
        <WorkspacesList workspaces={workspaces} />
      </div>

      {/* Recent activity */}
      <div className="border bg-bg-card border-border-default rounded-2xl p-5">
        <h3 className="text-text-primary text-[1.05rem] font-semibold mb-4">
          Recent activity
        </h3>
        <RecentActivityFeed items={recentActivity} />
      </div>
    </div>
  );
}

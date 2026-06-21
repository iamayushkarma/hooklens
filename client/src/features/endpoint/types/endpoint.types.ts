export interface Endpoint {
  _id: string;

  projectId: string;
  workspaceId: string;
  userId: string;

  slug: string;
  label: string;

  isActive: boolean;
  requestCount: number;

  createdAt: string;
  updatedAt: string;
}
export interface EndpointAnalytics {
  totalRequests: number;
  requestsToday: number;
  methodBreakdown: {
    method: string;
    count: number;
  }[];
  hourlyTimeline: {
    hour: string;
    count: number;
  }[];
  endpoint: {
    label: string;
    slug: string;
    isActive: boolean;
  };
}

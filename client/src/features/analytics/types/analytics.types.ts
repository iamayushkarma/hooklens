export interface MethodBreakdown {
  method: string;
  count: number;
}

export interface DailyTimelinePoint {
  date: string;
  count: number;
}

export interface TopEndpoint {
  _id: string;
  label: string;
  slug: string;
  requestCount: number;
}

export interface WorkspaceAnalytics {
  requestsToday: number;
  requestsYesterday: number;
  requestsDeltaPct: number | null;
  totalThisWeek: number;
  activeEndpointCount: number;
  methodBreakdown: MethodBreakdown[];
  dailyTimeline: DailyTimelinePoint[];
  topEndpoints: TopEndpoint[];
}

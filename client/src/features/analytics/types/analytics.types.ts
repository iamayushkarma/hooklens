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
  totalLastWeek: number;
  activeEndpointCount: number;
  totalEndpointCount: number;
  replaysLast30Days: number;
  replaysDeltaPct: number | null;
  methodBreakdown: { method: string; count: number }[];
  dailyTimeline: { date: string; count: number }[];
  topEndpoints: {
    _id: string;
    label: string;
    slug: string;
    requestCount: number;
  }[];
}

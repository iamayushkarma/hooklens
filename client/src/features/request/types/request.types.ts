export interface RequestLog {
  _id: string;

  endpointId: string;
  workspaceId: string;
  userId: string;

  method: string;

  headers: Record<string, string>;

  body: unknown;

  rawBody: string;

  query: Record<string, unknown>;

  ip: string;

  userAgent: string;

  contentType: string;

  size: number;

  createdAt: string;
  updatedAt: string;
}

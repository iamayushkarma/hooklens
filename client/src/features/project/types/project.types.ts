export interface Project {
  _id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  endpointCount: number;
  requestCount: number;
  lastActivityAt: string;
}

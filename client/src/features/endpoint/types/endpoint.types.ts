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

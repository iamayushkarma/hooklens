import api from "@/shared/api/axios";

export async function getWorkspaceAnalytics(workspaceId: string) {
  const res = await api.get(`/analytics/workspace/${workspaceId}`);

  return res.data.data;
}

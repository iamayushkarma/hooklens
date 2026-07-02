import api from "@/shared/api/axios";

export async function getMembers(workspaceId: string) {
  const res = await api.get(`/workspaces/${workspaceId}/members`);

  return res.data.data;
}

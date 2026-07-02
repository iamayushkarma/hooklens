import api from "@/shared/api/axios";

export async function removeMember(workspaceId: string, userId: string) {
  const res = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);

  return res.data.data;
}

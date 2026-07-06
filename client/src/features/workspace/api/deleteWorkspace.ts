import api from "@/shared/api/axios";

export async function deleteWorkspace(workspaceId: string) {
  const res = await api.delete(`/workspaces/${workspaceId}`);

  return res.data.data;
}

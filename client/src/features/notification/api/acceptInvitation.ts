import api from "@/shared/api/axios";

export async function acceptInvitation(token: string) {
  const res = await api.get(`/workspaces/invite/accept/${token}`);

  return res.data.data;
}

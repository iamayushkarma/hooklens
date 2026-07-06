import api from "@/shared/api/axios";

export async function declineInvitation(token: string) {
  const res = await api.post(`/workspaces/invite/decline/${token}`);

  return res.data.data;
}

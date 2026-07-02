import api from "@/shared/api/axios";

export interface AcceptInvitationResponse {
  workspaceId: string;
  workspaceName: string;
  role: string;
}

export async function acceptInvitation(
  token: string,
): Promise<AcceptInvitationResponse> {
  const res = await api.get(`/workspaces/invite/accept/${token}`);

  return res.data.data;
}

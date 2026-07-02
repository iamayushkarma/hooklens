import api from "@/shared/api/axios";

export interface InviteMemberPayload {
  email: string;
  role: "admin" | "member" | "viewer";
}

export async function inviteMember(
  workspaceId: string,
  payload: InviteMemberPayload,
) {
  const res = await api.post(`/workspaces/${workspaceId}/invite`, payload);

  return res.data.data;
}

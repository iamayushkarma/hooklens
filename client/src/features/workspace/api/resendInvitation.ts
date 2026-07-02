import api from "@/shared/api/axios";

export async function resendInvitation(
  workspaceId: string,
  invitationId: string,
) {
  const res = await api.post(
    `/workspaces/${workspaceId}/invitations/${invitationId}/resend`,
  );

  return res.data.data;
}

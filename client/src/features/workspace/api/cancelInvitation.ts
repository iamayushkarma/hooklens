import api from "@/shared/api/axios";

export async function cancelInvitation(
  workspaceId: string,
  invitationId: string,
) {
  const res = await api.delete(
    `/workspaces/${workspaceId}/invitations/${invitationId}`,
  );

  return res.data.data;
}

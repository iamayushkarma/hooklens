import api from "@/shared/api/axios";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export async function changeMemberRole(
  workspaceId: string,
  userId: string,
  role: WorkspaceRole,
) {
  const res = await api.patch(
    `/workspaces/${workspaceId}/members/${userId}/role`,
    {
      role,
    },
  );

  return res.data.data;
}

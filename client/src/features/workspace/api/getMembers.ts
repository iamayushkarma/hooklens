import api from "@/shared/api/axios";

export interface WorkspaceMember {
  memberId: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string;

  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface PendingInvitation {
  _id: string;

  email: string;

  role: "admin" | "member" | "viewer";

  expiresAt: string;
}

export interface MembersResponse {
  members: WorkspaceMember[];

  pendingInvites: PendingInvitation[];
}

export async function getMembers(
  workspaceId: string,
): Promise<MembersResponse> {
  const res = await api.get(`/workspaces/${workspaceId}/members`);

  return res.data.data;
}

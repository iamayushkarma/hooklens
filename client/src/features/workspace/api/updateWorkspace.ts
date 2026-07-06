import api from "@/shared/api/axios";

interface UpdateWorkspacePayload {
  workspaceId: string;
  name: string;
}

export async function updateWorkspace({
  workspaceId,
  name,
}: UpdateWorkspacePayload) {
  const res = await api.patch(`/workspaces/${workspaceId}`, {
    name,
  });

  return res.data.data;
}

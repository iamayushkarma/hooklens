import api from "@/shared/api/axios";

interface CreateEndpointPayload {
  label: string;
  workspaceId: string;
  projectId: string;
}

export async function createEndpoint(data: CreateEndpointPayload) {
  const res = await api.post("/endpoints", data);

  return res.data.data;
}

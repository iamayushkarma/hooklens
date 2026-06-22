import api from "@/shared/api/axios";

interface CreateEndpointPayload {
  label: string;
  projectId: string;
  workspaceId: string;
}

export async function createEndpoint(data: CreateEndpointPayload) {
  const res = await api.post("/endpoints", data);

  return res.data.data;
}

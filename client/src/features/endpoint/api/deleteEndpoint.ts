import api from "@/shared/api/axios";

export async function deleteEndpoint(endpointId: string): Promise<void> {
  await api.delete(`/endpoints/${endpointId}`);
}

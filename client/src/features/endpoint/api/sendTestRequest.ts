import api from "@/shared/api/axios";

export async function sendTestRequest(endpointId: string) {
  const res = await api.post(`/endpoints/${endpointId}/test`);

  return res.data.data;
}

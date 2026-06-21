import api from "@/shared/api/axios";

export async function getEndpointAnalytics(endpointId: string) {
  const res = await api.get(`/analytics/endpoint/${endpointId}`);

  return res.data.data;
}

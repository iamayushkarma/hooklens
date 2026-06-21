import api from "@/shared/api/axios";

export async function explainRequest(requestId: string) {
  const res = await api.post(`/requests/${requestId}/explain`);

  return res.data.data;
}

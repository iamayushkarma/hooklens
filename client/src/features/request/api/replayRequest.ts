import api from "@/shared/api/axios";

export async function replayRequest(requestId: string) {
  const res = await api.post(`/requests/${requestId}/replay`);

  return res.data.data;
}

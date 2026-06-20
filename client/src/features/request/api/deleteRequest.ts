import api from "@/shared/api/axios";

export async function deleteRequest(requestId: string) {
  const res = await api.delete(`/requests/${requestId}`);

  return res.data;
}

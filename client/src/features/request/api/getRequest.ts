import api from "@/shared/api/axios";
import type { RequestLog } from "../types/request.types";

export async function getRequest(requestId: string): Promise<RequestLog> {
  const res = await api.get(`/requests/${requestId}`);

  return res.data.data;
}

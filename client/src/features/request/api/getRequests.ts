import api from "@/shared/api/axios";
import type { RequestLog } from "../types/request.types";

interface RequestResponse {
  requests: RequestLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getRequests(
  endpointId: string,
): Promise<RequestResponse> {
  const res = await api.get(`/endpoints/${endpointId}/requests`);

  return res.data.data;
}

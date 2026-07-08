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
  page = 1,
  limit = 20,
): Promise<RequestResponse> {
  const res = await api.get(
    `/endpoints/${endpointId}/requests?page=${page}&limit=${limit}`,
  );

  return res.data.data;
}

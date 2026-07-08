import api from "@/shared/api/axios";

export interface ReplayResponse {
  original: {
    method: string;
    headers: Record<string, string>;
    body: unknown;
  };

  replay: {
    status: number;
    headers: Record<string, string>;
    body: string;
    durationMs: number;
  };
}

export async function replayRequest(
  requestId: string,
  targetUrl: string,
): Promise<ReplayResponse> {
  const res = await api.post(`/requests/${requestId}/replay`, {
    targetUrl,
  });

  return res.data.data;
}

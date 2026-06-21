import api from "@/shared/api/axios";
import type { Endpoint } from "../types/endpoint.types";

interface UpdateEndpointPayload {
  label?: string;
  isActive?: boolean;
}

export async function updateEndpoint(
  endpointId: string,
  payload: UpdateEndpointPayload,
): Promise<Endpoint> {
  const res = await api.patch(`/endpoints/${endpointId}`, payload);

  return res.data.data;
}

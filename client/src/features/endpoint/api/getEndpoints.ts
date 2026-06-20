import api from "@/shared/api/axios";
import type { Endpoint } from "../types/endpoint.types";

export async function getEndpoints(projectId: string): Promise<Endpoint[]> {
  const res = await api.get("/endpoints", {
    params: {
      projectId,
    },
  });

  return res.data.data;
}

import api from "@/shared/api/axios";

export async function getProjectRequests(projectId: string) {
  const res = await api.get(`/requests/project/${projectId}`);

  return res.data.data;
}

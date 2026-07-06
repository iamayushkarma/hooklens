import api from "@/shared/api/axios";

export async function deleteProject(projectId: string) {
  const res = await api.delete(`/projects/${projectId}`);

  return res.data.data;
}

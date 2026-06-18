import api from "@/shared/api/axios";

export async function getProjects(workspaceId: string) {
  const res = await api.get("/projects", {
    params: { workspaceId },
  });
  return res.data.data;
}

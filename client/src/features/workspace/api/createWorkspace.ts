import api from "@/shared/api/axios";

export async function createWorkspace(name: string) {
  const res = await api.post("/workspaces", { name });
  return res.data;
}

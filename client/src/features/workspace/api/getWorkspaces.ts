import api from "@/shared/api/axios";

export async function getWorkspaces() {
  const res = await api.get("/workspaces");
  return res.data.data;
}

import api from "@/shared/api/axios";
import type { Project } from "../types/project.types";

interface CreateProjectPayload {
  workspaceId: string;
  name: string;
  description?: string;
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  const res = await api.post("/projects", payload);

  return res.data.data;
}

import api from "@/shared/api/axios";

interface UpdateProjectPayload {
  projectId: string;
  name?: string;
  description?: string;
}

export async function updateProject({
  projectId,
  name,
  description,
}: UpdateProjectPayload) {
  const res = await api.patch(`/projects/${projectId}`, {
    name,
    description,
  });

  return res.data.data;
}

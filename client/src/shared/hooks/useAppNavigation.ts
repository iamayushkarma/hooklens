import { useNavigate } from "react-router-dom";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate("/login"),

    goToDashboard: () => navigate("/dashboard"),

    goToWorkspaces: () => navigate("/dashboard/workspaces"),

    goToWorkspace: (workspaceId: string) =>
      navigate(`/dashboard/workspaces/${workspaceId}`),

    goToProject: (workspaceId: string, projectId: string) =>
      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`),

    goBack: () => navigate(-1),
  };
}

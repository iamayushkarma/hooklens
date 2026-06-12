import { useNavigate } from "react-router-dom";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate("/login"),
    goToDashboard: () => navigate("/dashboard"),
    goToSettings: () => navigate("/settings"),
    goToWorkspaces: () => navigate("/workspaces"),
    goToProjects: () => navigate("/projects"),
    goBack: () => navigate(-1),
  };
}

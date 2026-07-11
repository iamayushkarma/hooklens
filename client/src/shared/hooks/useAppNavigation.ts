import { useNavigate, useLocation } from "react-router-dom";

export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    goToHome: () => navigate("/"),

    goToLogin: () => navigate("/login"),

    goToRegister: () => navigate("/register"),

    // Scrolls to a landing-page section by id (e.g. "features").
    // Navigates to "/" first if not already there, then scrolls.
    goToSection: (id: string) => {
      if (location.pathname !== "/") {
        navigate(`/#${id}`);
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },

    goToDashboard: () => navigate("/dashboard"),

    goToWorkspaces: () => navigate("/dashboard/workspaces"),

    goToWorkspace: (workspaceId: string) =>
      navigate(`/dashboard/workspaces/${workspaceId}`),

    goToProject: (workspaceId: string, projectId: string) =>
      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`),

    goBack: () => navigate(-1),
  };
}

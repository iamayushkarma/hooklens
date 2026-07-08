import { Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import AuthLayout from "@/app/layouts/AuthLayout";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import MainLayout from "@/app/layouts/MainLayout";
import HomePage from "@/features/public/pages/HomePage";
import Workspace from "@/features/workspace/pages/Workspace";
import Projects from "@/features/project/pages/Projects";
import WorkspaceLayout from "@/features/workspace/pages/WorkspaceLayout";
import WorkspaceMembers from "@/features/workspace/pages/WorkspaceMembers";
import WorkspaceSettings from "@/features/workspace/pages/WorkspaceSettings";
import ProjectLayout from "@/features/project/pages/ProjectLayout";
import ProjectRequests from "@/features/project/pages/ProjectRequests";
import Endpoint from "@/features/endpoint/pages/Endpoint";
import EndpointLayout from "@/features/endpoint/pages/EndpointLayout";
import EndpointRequests from "@/features/endpoint/pages/EndpointRequests";
import { EndpointAnalytics } from "@/features/endpoint/pages/EndpointAnalytics";
import AcceptInvitation from "@/features/workspace/pages/AcceptInvitation";
import EndpointSettings from "@/features/endpoint/pages/EndpointSettings";
import RequestDetail from "@/features/request/pages/RequestDetail";
export const appRoutes = (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/invite/accept/:token" element={<AcceptInvitation />} />
    </Route>
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="workspaces" element={<Workspace />} />
      <Route path="workspaces/:workspaceId" element={<WorkspaceLayout />}>
        <Route index element={<Projects />} />
        <Route path="members" element={<WorkspaceMembers />} />
        <Route path="settings" element={<WorkspaceSettings />} />
      </Route>

      <Route
        path="workspaces/:workspaceId/projects/:projectId"
        element={<ProjectLayout />}
      >
        <Route index element={<Endpoint />} />

        <Route path="requests" element={<ProjectRequests />} />
      </Route>
      <Route
        path="workspaces/:workspaceId/projects/:projectId/endpoints/:endpointId"
        element={<EndpointLayout />}
      >
        <Route index element={<EndpointRequests />} />

        <Route path="requests/:requestId" element={<RequestDetail />} />

        <Route path="analytics" element={<EndpointAnalytics />} />

        <Route path="settings" element={<EndpointSettings />} />
      </Route>
    </Route>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
    </Route>
  </Routes>
);

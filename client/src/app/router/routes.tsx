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
import WorkspaceOverview from "@/features/workspace/pages/WorkspaceOverview";
import WorkspaceMembers from "@/features/workspace/pages/WorkspaceMembers";
import WorkspaceInvitations from "@/features/workspace/pages/WorkspaceInvitations";
import WorkspaceSettings from "@/features/workspace/pages/WorkspaceSettings";

export const appRoutes = (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
    </Route>
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="workspaces" element={<Workspace />} />

      <Route path="workspaces/:workspaceId" element={<WorkspaceLayout />}>
        <Route index element={<WorkspaceOverview />} />

        <Route path="members" element={<WorkspaceMembers />} />

        <Route path="invitations" element={<WorkspaceInvitations />} />

        <Route path="settings" element={<WorkspaceSettings />} />
      </Route>
      <Route path="project" element={<Projects />} />
    </Route>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
    </Route>
  </Routes>
);

import { Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import AuthLayout from "@/app/layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "@/features/dashboard/Dashboard";

export const appRoutes = (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
    </Route>
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />{" "}
    </Route>
  </Routes>
);

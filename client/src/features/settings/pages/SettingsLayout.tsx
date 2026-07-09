import { Outlet } from "react-router-dom";
import Tabs from "@/shared/components/ui/Tabs";

function SettingsLayout() {
  const tabs = [
    {
      label: "Account",
      path: "/dashboard/settings/account",
    },
    {
      label: "Preferences",
      path: "/dashboard/settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-text-secondary">
          Manage your account and app-wide preferences.
        </p>
      </div>

      <Tabs tabs={tabs} />

      <Outlet />
    </div>
  );
}

export default SettingsLayout;

import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";

function AppSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-text-secondary">
          App-wide preferences. Workspace-specific settings live inside each
          workspace.
        </p>
      </div>

      <div className="rounded-lg border border-border-default bg-bg-card p-5 max-w-lg space-y-3">
        <div>
          <p className="text-sm font-medium">Theme</p>
          <p className="text-xs text-text-secondary">
            Switch between light and dark mode.
          </p>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default AppSettings;

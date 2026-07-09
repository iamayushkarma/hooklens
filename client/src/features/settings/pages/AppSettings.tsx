import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";

function AppSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-default bg-bg-card p-6 max-w-lg space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Switch between light and dark mode.
          </p>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default AppSettings;

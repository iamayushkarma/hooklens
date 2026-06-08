import { useThemeStore } from "@/store/ui.store";

function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const themes = ["light", "dark", "system"] as const;

  return (
    <div className="flex items-center rounded-lg border border-border-default bg-bg-card p-1">
      {themes.map((item) => (
        <button
          key={item}
          onClick={() => setTheme(item)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            theme === item
              ? "bg-accent text-white"
              : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
          }`}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;

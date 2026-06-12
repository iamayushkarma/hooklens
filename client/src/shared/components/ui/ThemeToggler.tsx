import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore } from "@/store/ui.store";
import { motion } from "motion/react";

function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const themes = [
    {
      icon: Sun,
      mode: "light",
      label: "Light",
    },
    {
      icon: Moon,
      mode: "dark",
      label: "Dark",
    },
    {
      icon: Monitor,
      mode: "system",
      label: "System",
    },
  ] as const;

  return (
    <div className="flex w-68 items-center rounded-lg border border-border-default bg-bg-card p-1">
      {themes.map((item) => {
        const Icon = item.icon;
        const isActive = theme === item.mode;
        return (
          <button
            key={item.mode}
            onClick={() => setTheme(item.mode)}
            className="relative cursor-pointer  flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium"
          >
            {isActive && (
              <motion.div
                layoutId="theme-switcher-pill"
                className="absolute inset-0 rounded-md pointer-events-none bg-bg-sidebar shadow-md border border-border-default"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <Icon
              className={`relative z-10 size-4 transition-colors ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`}
            />
            <span
              className={`relative z-10 transition-colors ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeSwitcher;

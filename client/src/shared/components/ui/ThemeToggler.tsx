// import { Sun, Moon, Monitor } from "lucide-react";
// import { useThemeStore } from "@/store/ui.store";
// import { motion } from "motion/react";

// function ThemeSwitcher() {
//   const theme = useThemeStore((state) => state.theme);
//   const setTheme = useThemeStore((state) => state.setTheme);

//   const themes = [
//     {
//       icon: Sun,
//       mode: "light",
//       label: "Light",
//     },
//     {
//       icon: Moon,
//       mode: "dark",
//       label: "Dark",
//     },
//     {
//       icon: Monitor,
//       mode: "system",
//       label: "System",
//     },
//   ] as const;

//   return (
//     <div className="flex w-68 items-center rounded-lg border border-border-default bg-bg-card p-1">
//       {themes.map((item) => {
//         const Icon = item.icon;
//         const isActive = theme === item.mode;
//         return (
//           <button
//             key={item.mode}
//             onClick={() => setTheme(item.mode)}
//             className="relative cursor-pointer  flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium"
//           >
//             {isActive && (
//               <motion.div
//                 layoutId="theme-switcher-pill"
//                 className="absolute inset-0 rounded-md pointer-events-none bg-bg-sidebar shadow-md border border-border-default"
//                 transition={{
//                   type: "spring",
//                   stiffness: 400,
//                   damping: 30,
//                 }}
//               />
//             )}
//             <Icon
//               className={`relative z-10 size-4 transition-colors ${
//                 isActive ? "text-text-primary" : "text-text-secondary"
//               }`}
//             />
//             <span
//               className={`relative z-10 transition-colors ${
//                 isActive ? "text-text-primary" : "text-text-secondary"
//               }`}
//             >
//               {item.label}
//             </span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// export default ThemeSwitcher;
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore } from "@/store/ui.store";
import { AnimatePresence, motion } from "motion/react";

interface ThemeSwitcherProps {
  variant?: "tabs" | "simple";
}

function ThemeSwitcher({ variant = "tabs" }: ThemeSwitcherProps) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  if (variant === "simple") {
    const isDark = theme === "dark";

    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:text-text-primary"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  }

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

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",

      setTheme: (theme) => {
        set({ theme });
      },

      toggleTheme: () => {
        const currentTheme = get().theme;

        set({
          theme: currentTheme === "dark" ? "light" : "dark",
        });
      },
    }),
    {
      name: "ui-storage",
    },
  ),
);

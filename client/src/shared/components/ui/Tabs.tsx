import { motion } from "motion/react";
import { NavLink } from "react-router-dom";

interface Tab {
  label: string;
  path: string;
}

interface TabsProps {
  tabs: Tab[];
}

function Tabs({ tabs }: TabsProps) {
  return (
    <div className="flex gap-2 bg-bg-sidebar border border-border-default w-fit rounded-md p-0.75">
      {tabs.map((tab) => (
        <NavLink key={tab.label} to={tab.path} end className="relative">
          {({ isActive }) => (
            <div className="relative px-2.5 py-1.5 text-sm">
              {isActive && (
                <motion.div
                  layoutId="workspace-tab-pill"
                  className="absolute inset-0 rounded-[5px] pointer-events-none bg-bg-card shadow-md border border-border-default"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  isActive
                    ? "font-medium text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {tab.label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export default Tabs;

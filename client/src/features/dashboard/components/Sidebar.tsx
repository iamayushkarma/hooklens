import logo from "@/assets/icons/logo-icon.png";
import { EllipsisVertical } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  PlugZap,
  Inbox,
  RefreshCw,
  ChartColumn,
  Users,
  MailPlus,
  Settings,
  Menu,
  BellRing,
  LogOut,
  CircleUserRound,
  type LucideIcon,
} from "lucide-react";
import logoDefault from "@/assets/icons/logo-default.png";
import type { User } from "@/features/auth/types/auth.types";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import Tooltip from "@/shared/components/ui/Tooltip";

function Sidebar() {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("clicked");
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("outside");
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    return setShowUserMenu((prev) => !prev);
  };

  const { user } = useAuthStore();
  const { goToDashboard } = useAppNavigation();

  return (
    <div
      className={`flex justify-between flex-col  bg-bg-sidebar border-r border-border-default  transition-all duration-200 ease-in-out
        ${collapsed ? "w-14" : "w-70"}
        `}
    >
      {/* Top section */}
      <div>
        {/* Logo */}
        <div className="py-3 px-4.5 flex justify-between items-center h-14 gap-2 border-b border-border-default">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => goToDashboard()}
                className="flex items-center gap-1 cursor-pointer overflow-hidden"
              >
                <img src={logo} className="w-5 flex-shrink-0" />
                <h1 className="font-semibold whitespace-nowrap">HookLens</h1>
              </motion.div>
            )}
          </AnimatePresence>
          {/* When collapsed, center the menu icon */}
          <div className={`${collapsed ? "w-full flex justify-center" : ""}`}>
            <Menu
              onClick={() => setCollapsed((prev) => !prev)}
              className="size-5 cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
            />
          </div>
        </div>
        {/* Navigations */}
        <div>
          {/* Home */}
          <SideNavigation
            heading="Home"
            className="mt-4"
            collapsed={collapsed}
            routes={[
              {
                label: "Dashboard",
                icon: LayoutDashboard,
                path: "/dashboard",
              },
              {
                label: "Workspace",
                icon: Building2,
                path: "/workspace",
              },
              {
                label: "Project",
                icon: FolderKanban,
                path: "/project",
              },
            ]}
          />
          {/* Monitoring */}
          <SideNavigation
            heading="Monitoring"
            collapsed={collapsed}
            routes={[
              {
                label: "Endpoints",
                icon: PlugZap,
                path: "/endpoints",
              },
              {
                label: "Requests",
                icon: Inbox,
                path: "/requests",
              },
              {
                label: "Replays",
                icon: RefreshCw,
                path: "/replays",
              },
              {
                label: "Analytics",
                icon: ChartColumn,
                path: "/analytics",
              },
            ]}
          />
          <SideNavigation
            heading="Team"
            collapsed={collapsed}
            routes={[
              {
                label: "Members",
                icon: Users,
                path: "/members",
              },
              {
                label: "Invitations",
                icon: MailPlus,
                path: "/invitations",
              },
            ]}
          />
        </div>
      </div>
      {/* Bottom section */}
      {!collapsed && (
        <div className="p-3 relative" ref={menuRef}>
          <div
            onClick={toggleUserMenu}
            className="py-2 px-2 hover:bg-base-hover rounded-md cursor-pointer flex items-center justify-between relative"
          >
            {/* User detail */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {/* User avatar */}

              <UserLogo />
              {/* User name  */}
              <div className="text-[.8rem] leading-4.5  min-w-0 flex-1">
                <h2 className="text-text-primary truncate">{user?.fullName}</h2>
                <p className="text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            {/* User actions */}
            <div>
              <EllipsisVertical className="size-4 text-text-secondary" />
            </div>
          </div>
          {showUserMenu && (
            <UserMenu
              user={user!}
              routes={[
                {
                  label: "Notification",
                  icon: BellRing,
                  path: "/members",
                },
                {
                  label: "Account",
                  icon: CircleUserRound,
                  path: "/invitations",
                },
                {
                  label: "Settings",
                  icon: Settings,
                  path: "/invitations",
                },
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;

// Helper component
interface RouteItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SideNavigationProps {
  heading: string;
  className?: string;
  collapsed: boolean;
  routes: RouteItem[];
}
const SideNavigation = ({
  className,
  heading,
  routes,
  collapsed,
}: SideNavigationProps) => {
  return (
    <div
      className={`${className} p-3 mt-2 ${collapsed && "flex items-center justify-center"}`}
    >
      {!collapsed && (
        <h2 className="text-text-secondary font-medium text-sm px-3">
          {heading}
        </h2>
      )}

      {/* Divider line replaces heading when collapsed */}
      {collapsed && <div className="border-t border-border-default mb-2" />}
      <ul className="grid mt-1 gap-1">
        {routes.map((route) => {
          const Icon = route.icon;

          return (
            <li key={route.label}>
              {collapsed ? (
                <Tooltip content={route.label} position="right">
                  <NavLink
                    to={route.path}
                    title={collapsed ? route.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 ${collapsed ? "py-1.5" : "py-1"} rounded-md transition-colors ${
                        isActive ? "bg-base-hover " : "hover:bg-base-hover"
                      }`
                    }
                  >
                    <Icon className="size-4" />
                    {!collapsed && (
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="font-medium text-[.9rem] overflow-hidden whitespace-nowrap"
                          >
                            {route.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    )}
                  </NavLink>
                </Tooltip>
              ) : (
                <NavLink
                  to={route.path}
                  title={collapsed ? route.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 ${collapsed ? "py-1.5" : "py-1"} rounded-md transition-colors ${
                      isActive ? "bg-base-hover " : "hover:bg-base-hover"
                    }`
                  }
                >
                  <Icon className="size-4" />
                  {!collapsed && (
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="font-medium text-[.9rem] overflow-hidden whitespace-nowrap"
                        >
                          {route.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

//---------------------------------------------

interface useMenueProps {
  user: User;
  routes: RouteItem[];
}

// User side profile section
const UserMenu = ({ user, routes }: useMenueProps) => {
  const { logout } = useAuthStore();
  const { goToLogin } = useAppNavigation();

  const handleLogout = () => {
    logout();
    goToLogin();
  };
  return (
    <div className="absolute w-58 bottom-7 -right-56 z-50 bg-bg-sidebar border border-border-default shadow-lg rounded-md">
      <div className="py-1">
        {/* User detail */}
        <div className="flex items-center gap-1 px-3 py-1.5 min-w-0 flex-1 border-b-2 border-border-default">
          {/* User avatar */}
          <UserLogo />
          {/* User name  */}
          <div className="text-[.8rem] leading-4.5  min-w-0 flex-1">
            <h2 className="text-text-primary truncate">{user?.fullName}</h2>
            <p className="text-text-secondary truncate">{user?.email}</p>
          </div>
        </div>
        <div className="border-b-2 border-border-default p-1">
          <ul>
            {routes.map((route) => {
              const Icon = route.icon;

              return (
                <li key={route.label}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1.5 px-3  rounded-md transition-colors ${
                        isActive ? "bg-base-hover " : "hover:bg-base-hover"
                      }`
                    }
                  >
                    <Icon className="size-4" />
                    <span className="font-medium text-[.9rem]">
                      {route.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-1">
          <div
            onClick={handleLogout}
            className="flex cursor-pointer py-1.5 px-3 items-center gap-2 rounded-md hover:bg-base-hover transition-colors"
          >
            <LogOut className="size-4" />
            <span className="font-medium text-[.9rem]">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

//---------------------------------

function UserLogo() {
  const { user } = useAuthStore();
  return (
    <>
      <div className="w-9">
        <img
          src={user?.avatarUrl || logoDefault}
          alt={user?.fullName}
          className="size-9 rounded-full overflow-hidden bg-muted"
        />
      </div>{" "}
    </>
  );
}

import { EllipsisVertical } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  CircleUserRound,
  type LucideIcon,
} from "lucide-react";
import logoDefault from "@/assets/icons/logo-default.png";
import type { User } from "@/features/auth/types/auth.types";
import { getWorkspaces } from "@/features/workspace/api/getWorkspaces";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import Tooltip from "@/shared/components/ui/Tooltip";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}
function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  useEffect(() => {
    onMobileClose();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  // Workspaces are only read here to resolve the current workspace's name
  // for the section heading below - there's no switcher in the sidebar.
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );

  useEffect(() => {
    if (workspaces.length === 0) {
      getWorkspaces()
        .then((data) => setWorkspaces(data))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The workspace whose id is in the URL takes priority over the
  // "last selected" workspace stored globally.
  const activeWorkspaceId = workspaceId ?? currentWorkspaceId ?? undefined;
  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);

  return (
    <div
      className={`flex justify-between flex-col bg-bg-sidebar border-r border-border-default transition-all duration-200 ease-in-out
    fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0
    h-dvh
    ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    ${collapsed ? "w-14" : "w-68"}
  `}
    >
      {/* Top section */}
      <div className="flex-1 overflow-y-auto overflow-x-visible min-h-0">
        {/* Logo / workspace label */}
        <div className="py-3 px-4.5 flex justify-between items-center h-14 gap-2 border-b border-border-default">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                onClick={goToDashboard}
                className="flex items-center cursor-pointer gap-1.5 overflow-hidden min-w-0 flex-1"
              >
                <span className="font-semibold text-sm whitespace-nowrap truncate">
                  {user?.fullName
                    ? `${user.fullName}'s Workspace`
                    : "My Workspace"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* When collapsed, center the menu icon */}
          <div
            className={`flex items-center gap-2 ${collapsed ? "w-full justify-center" : ""}`}
          >
            {/* Desktop collapse toggle */}
            <Menu
              onClick={() => setCollapsed((prev) => !prev)}
              className="size-5 cursor-pointer text-text-secondary hover:text-text-primary transition-colors hidden md:block"
            />
            {/* Mobile close button */}
            <X
              onClick={onMobileClose}
              className="size-5 cursor-pointer text-text-secondary hover:text-text-primary transition-colors md:hidden"
            />
          </div>
        </div>
        {/* Navigations */}
        <div>
          {/* General - always visible, workspace-agnostic */}
          <SideNavigation
            heading="General"
            className="mt-4"
            collapsed={collapsed}
            routes={[
              {
                label: "Dashboard",
                icon: LayoutDashboard,
                path: "/dashboard",
              },
              {
                label: "Workspaces",
                icon: Building2,
                path: "/dashboard/workspaces",
              },
            ]}
          />

          {/* Workspace-scoped section - only shown once a workspace is open */}
          {activeWorkspaceId && (
            <SideNavigation
              heading={activeWorkspace?.name ?? "Workspace"}
              collapsed={collapsed}
              routes={[
                {
                  label: "Projects",
                  icon: FolderKanban,
                  path: `/dashboard/workspaces/${activeWorkspaceId}`,
                },
                {
                  label: "Members",
                  icon: Users,
                  path: `/dashboard/workspaces/${activeWorkspaceId}/members`,
                },
                {
                  label: "Settings",
                  icon: Settings,
                  path: `/dashboard/workspaces/${activeWorkspaceId}/settings`,
                },
              ]}
            />
          )}
        </div>
      </div>
      {/* Bottom section - user menu. Stays reachable even when collapsed. */}
      <div className="p-3 relative" ref={menuRef}>
        {collapsed ? (
          <button
            onClick={toggleUserMenu}
            className="flex items-center justify-center w-full cursor-pointer py-1"
            title={user?.fullName}
          >
            <UserLogo />
          </button>
        ) : (
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
        )}
        {showUserMenu && (
          <UserMenu
            user={user!}
            collapsed={collapsed}
            routes={[
              {
                label: "Account",
                icon: CircleUserRound,
                path: "/dashboard/account",
              },
              {
                label: "Settings",
                icon: Settings,
                path: "/dashboard/settings",
              },
            ]}
          />
        )}
      </div>
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
        <h2 className="text-text-secondary font-medium text-sm px-3 truncate">
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
                    end
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
                  end
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
  collapsed: boolean;
}

// User side profile section
const UserMenu = ({ user, routes, collapsed }: useMenueProps) => {
  const { logout } = useAuthStore();
  const { goToLogin } = useAppNavigation();

  const handleLogout = () => {
    logout();
    goToLogin();
  };
  return (
    <div
      className={`absolute w-58 bottom-18 md:bottom-7 z-50 bg-bg-sidebar border border-border-default shadow-lg rounded-md ${
        collapsed ? "left-14 md:left-16" : "right-1 md:-right-56"
      }`}
    >
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
            className="flex cursor-pointer py-1.5 px-3 items-center gap-2 rounded-md hover:bg-danger-hover hover:text-white transition-colors"
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

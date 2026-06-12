import logo from "@/assets/icons/logo-icon.png";
import { EllipsisVertical } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
function Sidebar() {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const toggleUserMenu = () => {
    return setShowUserMenu((prev) => !prev);
  };
  const { user } = useAuthStore();
  return (
    <div className="w-70 flex justify-between flex-col bg-bg-sidebar border-r border-border-default">
      {/* Top section */}
      <div>
        {/* Logo */}
        <div className="py-3 px-4.5 flex items-center h-14 cursor-pointer gap-2 border-b border-border-default">
          <img src={logo} className="w-5" />
          <h1 className="font-semibold">HookLens</h1>
        </div>
        {/* Navigations */}
        <div>
          {/* Home */}
          <SideNavigation
            heading="Home"
            className="mt-4"
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
      <div className="p-3 relative">
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
    </div>
  );
}

export default Sidebar;

import { NavLink } from "react-router-dom";
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
  BellRing,
  LogOut,
  CircleUserRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import type { User } from "@/features/auth/types/auth.types";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

// Helper component
interface RouteItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SideNavigationProps {
  heading: string;
  className?: string;
  routes: RouteItem[];
}
const SideNavigation = ({
  className,
  heading,
  routes,
}: SideNavigationProps) => {
  return (
    <div className={`${className} p-3 mt-2`}>
      <h2 className="text-text-secondary font-medium text-sm px-3">
        {heading}
      </h2>
      <ul className="grid mt-1 gap-1">
        {routes.map((route) => {
          const Icon = route.icon;

          return (
            <li key={route.label}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                    isActive ? "bg-base-hover " : "hover:bg-base-hover"
                  }`
                }
              >
                <Icon className="size-4" />
                <span className="font-medium text-[.9rem]">{route.label}</span>
              </NavLink>
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

import logoDefault from "@/assets/icons/logo-default.png";

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

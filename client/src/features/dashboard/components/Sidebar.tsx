import logo from "@/assets/icons/logo-icon.png";
import { EllipsisVertical } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
function Sidebar() {
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
      <div className="py-3 px-1">
        <div className="py-2 px-2 hover:bg-base-hover rounded-md cursor-pointer flex items-center justify-between">
          {/* User detail */}
          <div className="flex items-center gap-1">
            {/* User avatar */}
            <div className="w-9">
              <img
                src={user?.avatarUrl}
                alt={user?.fullName}
                className="size-9 rounded-full overflow-hidden bg-muted"
              />
            </div>
            {/* User name  */}
            <div className="text-[.8rem] leading-4.5">
              <h2 className="text-text-primary">{user?.fullName}</h2>
              <p className="text-text-secondary">{user?.email}</p>
            </div>
          </div>
          {/* User actions */}
          <div>
            <EllipsisVertical className="size-4 text-text-secondary" />
          </div>
        </div>
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
  type LucideIcon,
} from "lucide-react";

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

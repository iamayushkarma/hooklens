import type { WorkspaceProp } from "@/features/workspace/types/workspace.type";
import { useWorkspaceStore } from "@/store/workspace.store";
import { FolderKanban, Users, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleBadge } from "@/shared/components/ui/role-badge";
import type { Role } from "@/shared/lib/role-colors";
import { LuArrowUpRight } from "react-icons/lu";

const pastelColors = [
  { bg: "#E8EAFF", text: "#3D3F8F", darkBg: "#2A2C52", darkText: "#B4B8FF" }, // Periwinkle
  { bg: "#E4F0E8", text: "#2D6641", darkBg: "#1C3527", darkText: "#92D4A4" }, // Sage
  { bg: "#FCE8EE", text: "#9C2D4A", darkBg: "#3D1A25", darkText: "#F4A8BE" }, // Blush
  { bg: "#FEF3DC", text: "#8A5D00", darkBg: "#3A2B05", darkText: "#F5CC6A" }, // Amber
  { bg: "#F0E8FB", text: "#6D3AAC", darkBg: "#2C1A42", darkText: "#D4A8F8" }, // Lavender
  { bg: "#E0F4F8", text: "#1A6678", darkBg: "#0E2D35", darkText: "#7FD4E8" }, // Glacier
  { bg: "#FDEEE5", text: "#AA4020", darkBg: "#3D1C0E", darkText: "#F7B898" }, // Peach
  { bg: "#E2F6F0", text: "#1A6B55", darkBg: "#0E2E24", darkText: "#7FD4C0" }, // Seafoam
];
function WorkspaceCard({ ...workspace }: WorkspaceProp) {
  const [showOpenWorkspace, setShowOpenWorkspace] = useState(false);
  const navigate = useNavigate();
  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );
  console.log(useWorkspaceStore.getState());
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const getWorkspaceColor = (name: string) => {
    const hash = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  };
  const color = getWorkspaceColor(workspace.name);
  return (
    <div
      onClick={() => {
        setCurrentWorkspaceId(workspace._id);
        navigate(`/dashboard/workspaces/${workspace._id}`);
      }}
      onMouseEnter={() => setShowOpenWorkspace(true)}
      onMouseLeave={() => setShowOpenWorkspace(false)}
      className="rounded-lg border border-border-default bg-bg-card transition-all hover:border-border-hover hover:shadow-sm cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <div className="flex items-center gap-2">
          <div
            style={
              {
                "--avatar-bg": color.bg,
                "--avatar-text": color.text,
                "--avatar-dark-bg": color.darkBg,
                "--avatar-dark-text": color.darkText,
                backgroundColor: "var(--avatar-bg)",
                color: "var(--avatar-text)",
              } as React.CSSProperties
            }
            className="flex items-center text-text-primary justify-center rounded-md"
          >
            <span className="p-2.5 text-[.9rem] font-medium">
              {getInitials(workspace.name)}
            </span>
          </div>
          <div>
            <h2 className="truncate text-base font-semibold">
              {workspace.name}
            </h2>
            <p className="text-text-secondary text-[.8rem]">
              Created{" "}
              {new Date(workspace.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <RoleBadge role={workspace.yourRole as Role} />
      </div>

      {/* Stats */}
      <div className="flex items-center p-4 gap-2">
        <StateCard
          count={workspace.projectCount}
          icon={FolderKanban}
          stateFor="Projects"
        />
        <StateCard
          count={workspace.memberCount}
          icon={Users}
          stateFor="Member"
        />
      </div>

      {/* Footer */}
      <div className="border-t p-4 border-border-default pt-3 flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          Updated {formatDate(workspace.updatedAt)}
        </p>
        <div
          className={`px-2 py-0.75 bg-bg-sidebar text-[.78rem] rounded-md hover:bg-base-hover flex items-center gap-1 border border-border-default transition-all duration-200 ${
            showOpenWorkspace
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          Go to workspace
          <LuArrowUpRight />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCard;

type StateCardProp = {
  count: number;
  icon: LucideIcon;
  stateFor: string;
};
const StateCard = ({ count, icon: Icon, stateFor }: StateCardProp) => {
  return (
    <div className="flex items-center gap-2 bg-bg-sidebar px-4 py-3 rounded-md  w-full">
      <Icon className="size-4 text-text-secondary" />
      <div>
        <p className="text-xs text-text-secondary">{stateFor}</p>
        <p className="text-md font-semibold">{count}</p>
      </div>
    </div>
  );
};

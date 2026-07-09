import { Link } from "react-router-dom";

interface WorkspaceMiniCardProps {
  id: string;
  name: string;
  role: string;
  projectCount: number;
  memberCount: number;
}

export function WorkspaceMiniCard({
  id,
  name,
  role,
  projectCount,
  memberCount,
}: WorkspaceMiniCardProps) {
  return (
    <Link
      to={`/workspace/${id}`}
      className="block border border-border-default rounded-xl p-3.5 hover:bg-bg-sidebar transition-colors"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-text-primary text-[.88rem] font-medium truncate">
          {name}
        </span>
        <span
          className={`text-[.68rem] font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${
            role === "owner"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-bg-sidebar text-text-secondary"
          }`}
        >
          {role === "owner" ? "Owner" : "Member"}
        </span>
      </div>
      <p className="text-text-secondary text-[.78rem]">
        {projectCount} project{projectCount !== 1 && "s"} · {memberCount} member
        {memberCount !== 1 && "s"}
      </p>
    </Link>
  );
}

import {
  roleBadgeClass,
  roleDotClass,
  type Role,
} from "@/shared/lib/role-colors";

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full
      border px-2.5 py-0.5 text-xs font-medium capitalize
      ${roleBadgeClass[role]}`}
    >
      <span className={`size-1.5 rounded-full ${roleDotClass[role]}`} />
      {role}
    </span>
  );
}

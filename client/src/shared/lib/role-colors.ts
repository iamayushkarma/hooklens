export type Role = "owner" | "admin" | "member" | "viewer";

export const ROLE_LEVEL: Record<Role, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export const roleBadgeClass: Record<Role, string> = {
  owner:
    "bg-[var(--color-owner-bg)] text-[var(--color-owner-text)] border-[var(--color-owner-border)]",
  admin:
    "bg-[var(--color-admin-bg)] text-[var(--color-admin-text)] border-[var(--color-admin-border)]",
  member:
    "bg-[var(--color-member-bg)] text-[var(--color-member-text)] border-[var(--color-member-border)]",
  viewer:
    "bg-[var(--color-viewer-bg)] text-[var(--color-viewer-text)] border-[var(--color-viewer-border)]",
};

export const roleDotClass: Record<Role, string> = {
  owner: "bg-[var(--color-owner-text)]",
  admin: "bg-[var(--color-admin-text)]",
  member: "bg-[var(--color-member-text)]",
  viewer: "bg-[var(--color-viewer-text)]",
};

export function hasPermission(user: Role, required: Role): boolean {
  return ROLE_LEVEL[user] >= ROLE_LEVEL[required];
}

import { z } from "zod";

const createWorkspaceScheme = z.object({
  body: z.object({
    name: z.string().min(3, "Name too short").max(50, "Name too long"),
  }),
});
const updateWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50).trim(),
  }),
});
const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    role: z.enum(["admin", "member", "viewer"]).default("member"),
  }),
});
const changeMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "member", "viewer"]),
  }),
});

export {
  createWorkspaceScheme,
  updateWorkspaceSchema,
  inviteMemberSchema,
  changeMemberRoleSchema,
};

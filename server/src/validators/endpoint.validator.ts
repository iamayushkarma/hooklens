import { z } from "zod";

export const createEndpointSchema = z.object({
  projectId: z.string().min(1),
  workspaceId: z.string().min(1),
  label: z.string().min(1).max(100).trim(),
});

export const updateEndpointSchema = z
  .object({
    label: z.string().min(1).max(100).trim().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field required",
  });

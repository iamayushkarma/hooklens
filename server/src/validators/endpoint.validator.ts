import { z } from "zod";
import { isValidObjectId } from "mongoose";

// Reusable ObjectId check - prevents CastError crashes in MongoDB
const objectId = z
  .string()
  .refine(isValidObjectId, { message: "Invalid ID format" });

export const createEndpointSchema = z.object({
  projectId: objectId,
  workspaceId: objectId,
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

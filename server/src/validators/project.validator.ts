import { z } from "zod";

const getProjectsSchema = z.object({
  query: z.object({
    workspaceId: z.string().min(1),

    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});

const createProjectSchema = z.object({
  body: z.object({
    workspaceId: z.string().min(1, "Workspace ID is required"),

    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(100, "Project name cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),

    description: z.string().trim().max(1000).optional(),
  }),
});

export { getProjectsSchema, createProjectSchema, updateProjectSchema };

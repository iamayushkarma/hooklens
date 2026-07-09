import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().trim().min(2, {
    message: "Full name must be at least 2 characters",
  }),

  email: z.string().trim().email({
    message: "Please provide a valid email address",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const loginSchema = z.object({
  email: z.string().trim().email({
    message: "Please provide a valid email address",
  }),

  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, {
      message: "Full name must be at least 2 characters",
    })
    .max(80, {
      message: "Full name cannot exceed 80 characters",
    }),

  avatarUrl: z
    .string()
    .trim()
    .url({ message: "Avatar must be a valid URL" })
    .optional()
    .or(z.literal("")),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required",
    }),

    newPassword: z.string().min(6, {
      message: "New password must be at least 6 characters",
    }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
};

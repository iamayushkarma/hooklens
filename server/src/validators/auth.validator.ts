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

export { registerSchema, loginSchema };

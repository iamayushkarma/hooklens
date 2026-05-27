import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export { registerSchema, loginSchema };

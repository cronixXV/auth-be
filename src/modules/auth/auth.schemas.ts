import { z } from "zod";

export const registerSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;

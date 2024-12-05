import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

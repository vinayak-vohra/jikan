import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      // consider empty strings as undefined
      .transform((value) => (value.length ? value : undefined))
      .optional(),
  ]),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      // consider empty strings as undefined
      .transform((value) => (value.length ? value : undefined))
      .optional(),
  ]),
});
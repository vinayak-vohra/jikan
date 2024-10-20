import { z } from "zod";

export const createWorkSpaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      // consider empty strings as undefined
      .transform((value) => (value.length ? value : undefined))
      .optional(),
  ]),
});

export const updateWorkSpaceSchema = z.object({
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

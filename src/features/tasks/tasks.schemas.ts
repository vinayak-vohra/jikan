import z from "zod";
import { STATUS } from "./tasks.types";

export const createTaskSchema = z.object({
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  name: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  assigneeId: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(STATUS, {
    required_error: "Required",
    message: "Invalid status",
  }),
  dueDate: z.coerce.date(),
});

export const fetchTaskSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  notStatus: z
    .union([z.nativeEnum(STATUS), z.array(z.nativeEnum(STATUS))])
    .nullish(),
  status: z
    .union([z.nativeEnum(STATUS), z.array(z.nativeEnum(STATUS))])
    .nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export const bulkUpdateSchema = z.object({
  tasks: z.array(
    z.object({
      $id: z.string(),
      status: z.nativeEnum(STATUS),
      position: z.number().int().positive().min(1000).max(1_000_000),
    })
  ),
});

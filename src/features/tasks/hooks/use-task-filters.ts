import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { STATUS } from "../tasks.types";

export function useTaskFilters() {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(STATUS)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
}

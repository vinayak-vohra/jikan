import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

export function useEditTaskModal() {
  // handle update-task-form via url query
  const [taskId, setTaskId] = useQueryState(
    "edit-task",
    parseAsString
  );

  const openModal = (id: string) => setTaskId(id);
  const closeModal = () => setTaskId(null);

  return {
    taskId,
    openModal,
    closeModal,
    setTaskId,
  };
}

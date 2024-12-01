import { parseAsBoolean, useQueryState } from "nuqs";

export function useCreateTaskModal() {
  // handle create-task-form via url query
  const [isModalOpen, setIsModalOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
    setIsModalOpen,
  };
}

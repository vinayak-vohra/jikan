import { parseAsBoolean, useQueryState } from "nuqs";

export function useProjectModal() {
  // handle create-project-form via url query
  const [isModalOpen, setIsModalOpen] = useQueryState(
    "create-project",
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

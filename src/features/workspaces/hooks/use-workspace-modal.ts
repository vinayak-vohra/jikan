import { parseAsBoolean, useQueryState } from "nuqs";

export function useWorkspaceModal() {
  // handle create-workspace-form via url query
  const [isModalOpen, setIsModalOpen] = useQueryState(
    "create-workspace",
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

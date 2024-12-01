"use client";

import { useProjectModal } from "@/features/projects/hooks";
import { ResponsiveModal } from "../../../components/ui/modal";
import CreateProjectForm from "./create-project-form";

export default function CreateProjectModal() {
  const { isModalOpen, setIsModalOpen, closeModal } = useProjectModal();
  return (
    <ResponsiveModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <CreateProjectForm onCancel={closeModal} />
    </ResponsiveModal>
  );
}

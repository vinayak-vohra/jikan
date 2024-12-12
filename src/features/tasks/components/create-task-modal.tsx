"use client";

import { ResponsiveModal } from "@/components/ui/modal";
import CreateTaskForm from "./create-task-form";
import { useCreateTaskModal } from "@/providers/task-modal-provider";



export default function CreateTaskModal() {
  const { isModalOpen, setIsModalOpen, closeModal } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <CreateTaskForm onCancel={closeModal} />
    </ResponsiveModal>
  );
}

"use client";

import { ResponsiveModal } from "@/components/ui/modal";
import CreateTaskForm from "./create-task-form";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";


export default function CreateTaskModal() {
  const { isModalOpen, setIsModalOpen, closeModal } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <CreateTaskForm onCancel={closeModal} />
    </ResponsiveModal>
  );
}

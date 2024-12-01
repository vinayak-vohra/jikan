"use client";

import { ResponsiveModal } from "@/components/ui/modal";
import { useEditTaskModal } from "../hooks/use-update-task-modal";
import EditTaskForm from "./edit-task-form";

export default function EditTaskModal() {
  const { taskId, closeModal } = useEditTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={closeModal}>
      {taskId && <EditTaskForm taskId={taskId} onCancel={closeModal} />}
    </ResponsiveModal>
  );
}

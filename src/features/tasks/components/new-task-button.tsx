"use client";

import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "@/providers/task-modal-provider";

import { PlusIcon } from "lucide-react";

export default function NewTaskButton() {
  const { openModal } = useCreateTaskModal();
  return (
    <Button onClick={() => openModal()} variant="primary" size="sm">
      <PlusIcon className="size-4" />
      <span className="hidden md:block">&nbsp;New</span>
    </Button>
  );
}

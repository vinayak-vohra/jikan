"use client";

import { STATUS } from "@/features/tasks/tasks.types";
import { PropsWithChildren } from "@/types/global.types";
import { parseAsBoolean, useQueryState } from "nuqs";
import { createContext, useContext, useState } from "react";

interface ITaskModal {
  status: STATUS;
  isModalOpen: boolean;
  openModal: (status?: STATUS) => void;
  closeModal: () => void;
  setIsModalOpen: (value: boolean) => void;
}

const TaskModalContext = createContext<ITaskModal | null>(null);

export function useCreateTaskModal() {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error(
      "useCreateTaskModal must be used within a TaskModalProvider"
    );
  }
  return context;
}

export default function TaskModalProvider({ children }: PropsWithChildren) {
  const [isModalOpen, setIsModalOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [status, setStatus] = useState(STATUS.TODO);

  const openModal = (status = STATUS.TODO) => {
    setStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <TaskModalContext.Provider
      value={{ status, isModalOpen, openModal, closeModal, setIsModalOpen }}
    >
      {children}
    </TaskModalContext.Provider>
  );
}

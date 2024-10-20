"use client";

import { ResponsiveModal } from "../../../components/ui/modal";

import { useWorkspaceModal } from "@/features/workspaces/hooks";
import CreateWorkpaceForm from "./create-workspace-form";

export default function CreateWorkspaceModal() {
  const { isModalOpen, setIsModalOpen, closeModal } = useWorkspaceModal();
  return (
    <ResponsiveModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <CreateWorkpaceForm onCancel={closeModal}/>
    </ResponsiveModal>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLinkIcon,
  Loader2Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useEditTaskModal } from "../hooks/use-update-task-modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export default function TaskActions({
  id: taskId,
  projectId,
  children,
}: TaskActionsProps) {
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const [DeleteTaskDialog, confirmDelete] = useConfirmation({
    title: `Delete Task`,
    description: `Are you sure you want to delete this task?`,
    variant: "destructive",
  });

  const { openModal } = useEditTaskModal();

  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const baseURL = `/workspaces/${workspaceId}`;

  const onOpenTask = () => {
    router.push(`${baseURL}/tasks/${taskId}`);
  };
  const onOpenProject = () => {
    router.push(`${baseURL}/projects/${projectId}`);
  };

  const onDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteTask({ param: { taskId } });
  };

  return (
    <div className="flex justify-end cursor-pointer">
      <DeleteTaskDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="w-48">
          <DropdownMenuItem className="p-[10px]" onClick={onOpenTask}>
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px]" onClick={onOpenProject}>
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[10px]"
            onClick={() => openModal(taskId)}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive p-[10px]"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending && (
              <Loader2Icon className="animate-spin size-4 mr-2 stroke-2" />
            )}
            {!isPending && <TrashIcon className="size-4 mr-2 stroke-2" />}
            {isPending ? "Deleting" : "Delete"} Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

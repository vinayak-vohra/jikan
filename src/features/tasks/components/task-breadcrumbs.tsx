import { IProject } from "@/features/projects/projects.types";
import { ITaskPopulated } from "../tasks.types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import Link from "next/link";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useRouter } from "next/navigation";

interface TaskBreadCrumbsProps {
  task: ITaskPopulated;
  project: IProject;
}

export default function TaskBreadCrumbs({
  project,
  task,
}: TaskBreadCrumbsProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const [DeleteTaskDialog, confirmDelete] = useConfirmation({
    title: `Delete Task`,
    description: `Are you sure you want to delete this task?`,
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess() {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <DeleteTaskDialog />
      <ProjectAvatar name={project.name} image={project.image} size={6} />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-base font-semibold text-muted-foreground hover:opacity-75 hover:underline underline-offset-2 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-base font-semibold">{task.name}</p>
      <Button
        className="ml-auto"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        <TrashIcon className="size-4" />
        <span className="ml-2 hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
}

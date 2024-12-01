import { Button } from "@/components/ui/button";
import { ITaskPopulated } from "../tasks.types";
import { PencilIcon } from "lucide-react";
import OverviewProperty from "./overview-property";
import MemberAvatar from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import { toTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEditTaskModal } from "../hooks/use-update-task-modal";

interface TaskOverviewProps {
  task: ITaskPopulated;
}

export default function TaskOverview({ task }: TaskOverviewProps) {
  const { openModal } = useEditTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">Overview</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openModal(task.$id)}
          >
            <PencilIcon className="size-4 mr-1" />
            Edit
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6 border" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate dueDate={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>{toTitleCase(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}

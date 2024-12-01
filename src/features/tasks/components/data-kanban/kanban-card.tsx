import { MoreHorizontalIcon } from "lucide-react";

import TaskActions from "../task-actions";
import TaskDate from "../task-date";
import { ITaskPopulated } from "../../tasks.types";

import { Separator } from "@/components/ui/separator";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
  task: ITaskPopulated;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="bg-background py-2 px-2.5 mb-1.5 rounded shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <div className="p-0.5 rounded border-2 border-transparent hover:border-muted hover:bg-muted/50 transition">
            <MoreHorizontalIcon className="size-5 stroke-1 text-muted-foreground" />
          </div>
        </TaskActions>
      </div>
      <Separator />
      <div className="flex items-center text-xs gap-x-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.image}
          size={5}
          className="text-[10px]"
        />
        <span>{task.project.name}</span>
      </div>
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee.name}
          className="size-5 text-[10px]"
        />
        <div className="size-1 bg-muted-foreground rounded-full" />
        <TaskDate
          className="text-[10px] font-semibold"
          dueDate={task.dueDate}
        />
      </div>
    </div>
  );
}

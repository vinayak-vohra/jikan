import { ITaskPopulated } from "../../tasks.types";

import { cn, createTWClasses } from "@/lib/utils";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useRouter } from "next/navigation";

export type Event = {
  title: string;
  start: Date;
  end: Date;
} & Pick<ITaskPopulated, "project" | "assignee" | "status" | "$id">;

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${event.$id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={handleClick}
        className={cn(
          "p-1.5 text-xs text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          createTWClasses({ border: 500 }, event.status)
        )}
      >
        <p>{event.title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={event.assignee.name} className="size-5 text-xs" />
          <div className="size-1 bg-muted-foreground rounded-full" />
          <ProjectAvatar
            name={event.project.name}
            size={5}
            className="text-xs"
            image={event.project.image}
          />
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/lib/utils";
import { STATUS } from "../../tasks.types";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";

type KanbanColumnProps = {
  board: STATUS;
  taskCount: number;
};

const statusIconMap: Record<STATUS, React.ReactNode> = {
  [STATUS.BACKLOG]: <CircleDashedIcon className="size-5 text-red-500" />,
  [STATUS.TODO]: <CircleIcon className="size-5 text-indigo-500" />,
  [STATUS.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-5 text-purple-500" />
  ),
  [STATUS.IN_REVIEW]: <CircleDotIcon className="size-5 text-yellow-500" />,
  [STATUS.DONE]: <CircleCheckIcon className="size-5 text-green-500" />,
};

export default function KanbanColumnHeader(props: KanbanColumnProps) {
  return (
    <Badge
      variant={props.board}
      className="px-2 py-1.5 rounded-none rounded-t-md flex items-center justify-between"
    >
      <div className="flex items-center gap-x-2">
        {statusIconMap[props.board]}
        <h3>{toTitleCase(props.board)}</h3>
        <span>{props.taskCount}</span>
      </div>

      <Button
        variant="ghost"
        className="size-6 p-0 bg-transparent hover:bg-background/80"
      >
        <PlusIcon className="size-4" />
      </Button>
    </Badge>
  );
}

import { cn, parseAsDate } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

interface TaskDateProps {
  dueDate: Date | string;
  className?: string;
}

export default function TaskDate(props: TaskDateProps) {
  const today = new Date();
  const dueDate = parseAsDate(props.dueDate);
  const diffDays = differenceInDays(dueDate, today);

  let textColor = "text-muted-foreground";

  if (diffDays <= 3) {
    textColor = "text-red-500";
  } else if (diffDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={cn(textColor, "text-xs truncate", props.className)}>
      {format(props.dueDate, "PPP")}
    </div>
  );
}

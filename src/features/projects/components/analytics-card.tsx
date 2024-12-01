import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, toTitleCase } from "@/lib/utils";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

interface AnalayticsCardProps {
  title: string;
  value: number;
  hasIncreased: boolean;
  changeValue: number;
}

export default function AnalayticsCard({
  title,
  value,
  hasIncreased,
  changeValue,
}: AnalayticsCardProps) {
  const Icon = hasIncreased ? FaCaretUp : FaCaretDown;
  const textColor = hasIncreased ? "text-green-500" : "text-red-500";

  return (
    <Card className="w-full rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{toTitleCase(title)}</span>
          </CardDescription>
          <div className={cn("flex items-center gap-x-1", textColor)}>
            <Icon className="size-4" />
            <span className="truncate text-base font-medium">
              {changeValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

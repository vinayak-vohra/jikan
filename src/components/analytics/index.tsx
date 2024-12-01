import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IAnalytics } from "@/types/global.types";
import { AnalyticsCard } from "./analytics-card";
import { AnalyticsSkeleton } from "./analytics-skeleton";

interface AnalyticsProps {
  data: IAnalytics;
}

export default function Analytics({ data }: AnalyticsProps) {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center flex-1">
            <AnalyticsCard
              title={key}
              value={value.count}
              changeValue={value.difference}
              hasIncreased={value.difference > 0}
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export { AnalyticsCard, AnalyticsSkeleton };

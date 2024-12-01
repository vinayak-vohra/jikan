import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AnalayticsCard from "./analytics-card";
import { useFetchProjectAnalytics, useProjectId } from "../hooks";
import Loader from "@/components/loader";

export default function ProjectAnalytics() {
  const projectId = useProjectId();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useFetchProjectAnalytics(projectId);

  if (isLoadingAnalytics) return <Loader />;
  if (!analytics) return <div>No analytics data</div>;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-2">
        {Object.entries(analytics).map(([key, value]) => (
          <div key={key} className="flex items-center flex-1">
            <AnalayticsCard
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

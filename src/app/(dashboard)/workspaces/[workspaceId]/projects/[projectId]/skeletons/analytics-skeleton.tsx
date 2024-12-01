import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton({ count = 5 }: { count: number }) {
  return (
    <div className="w-full flex flex-row gap-2">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="w-full flex-1 min-h-16" />
      ))}
    </div>
  );
}

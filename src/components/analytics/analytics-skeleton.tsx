import { Skeleton } from "../ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="w-full max-w-screen-xl overflow-x-auto flex flex-row gap-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-6 bg-background rounded-lg flex-1"
        >
          <div className="flex items-center gap-x-2.5">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="size-5" />
            <Skeleton className="w-8 h-5" />
          </div>

          <Skeleton className="w-12 h-12" />
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from "../ui/skeleton";

export default function SidebarSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex h-8 items-center justify-between text-neutral-500">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="w-full h-9 px-3 rounded-md" />
      ))}
    </div>
  );
}

"use client";

import ErrorPage from "@/components/error";
import Loader from "@/components/loader";
import { Separator } from "@/components/ui/separator";
import TaskBreadCrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskDescription from "@/features/tasks/components/task-description";
import TaskOverview from "@/features/tasks/components/task-overview";
import { useFetchTaskById } from "@/features/tasks/hooks/use-fetch-task-by-id";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

export default function TaskIdClient() {
  const taskId = useTaskId();
  const { data, isLoading } = useFetchTaskById(taskId);

  if (isLoading) return <Loader />;

  if (!data) return <ErrorPage message="Task Not Found" />;
  return (
    <div className="flex w-full flex-col gap-y-4">
      <TaskBreadCrumbs project={data.project} task={data} />
      {/* <Separator className="my-4 bg-background" /> */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
}

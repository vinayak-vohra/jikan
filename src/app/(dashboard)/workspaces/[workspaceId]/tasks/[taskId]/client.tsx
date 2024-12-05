"use client";

import ErrorCard from "@/components/error";
import Loader from "@/components/loader";
import TaskBreadCrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskDescription from "@/features/tasks/components/task-description";
import TaskOverview from "@/features/tasks/components/task-overview";
import { useFetchTaskById, useTaskId } from "@/features/tasks/hooks";

export default function TaskIdClient() {
  const taskId = useTaskId();
  const { data, isLoading, error, refetch } = useFetchTaskById(taskId);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!data) return null;

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

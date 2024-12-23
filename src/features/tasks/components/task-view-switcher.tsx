"use client";
import { Loader } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectId } from "@/features/projects/hooks";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { convertNullToUndefined } from "@/lib/utils";

import DataCalendar from "./data-calendar";
import DataKanban from "./data-kanban";
import DataTable, { columns } from "./data-table";
import TaskFilters from "./task-filters";

import { useFetchTasks } from "../hooks/use-fetch-tasks";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useBulkUpdateTask } from "../hooks/use-bulk-update-tasks";
import { TaskUpdatePayload } from "../tasks.types";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
}

export default function TaskViewSwitcher(props: TaskViewSwitcherProps) {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
    clearOnDefault: true,
  });

  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { mutate: bulkUpdateTasks } = useBulkUpdateTask();

  const [filters] = useTaskFilters();

  const { data: tasks, isLoading } = useFetchTasks({
    workspaceId,
    ...convertNullToUndefined(filters),
    projectId: filters.projectId || projectId,
  });

  const onKanbanChange = useCallback(
    (payload: TaskUpdatePayload[]) => {
      bulkUpdateTasks({ json: { tasks: payload } });
    },
    [bulkUpdateTasks]
  );

  return (
    <Tabs
      className="w-full border border-muted p-2 bg-background rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full w-full flex flex-col overflow-auto max-md:p-0 gap-y-2">
        <div className="flex flex-col w-full gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto" defaultValue="table">
            <TabsTrigger
              value="table"
              className="h-8 w-full md:min-w-32 lg:w-auto"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="kanban"
              className="h-8 w-full md:min-w-32 lg:w-auto"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="h-8 w-full md:min-w-32 lg:w-auto"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <TaskFilters
          hideAssigneeFilter={props.hideAssigneeFilter}
          hideProjectFilter={props.hideProjectFilter}
        />
        <Separator />
        <div className="flex flex-col min-h-40 px-2">
          {isLoading && <Loader className="size-5 animate-spin my-10 mx-auto" />}
          {!isLoading && (
            <>
              <TabsContent value="table">
                <DataTable columns={columns} data={tasks?.documents || []} />
              </TabsContent>
              <TabsContent value="kanban">
                <DataKanban
                  data={tasks?.documents || []}
                  onChange={onKanbanChange}
                />
              </TabsContent>
              <TabsContent value="calendar">
                <DataCalendar data={tasks?.documents || []} />
              </TabsContent>
            </>
          )}
        </div>
      </div>
    </Tabs>
  );
}

"use client";

import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { CalendarIcon, ExternalLinkIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import Analytics, { AnalyticsSkeleton } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton as Skelly } from "@/components/ui/skeleton";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useFetchProjects, useProjectModal } from "@/features/projects/hooks";
import { useFetchTasks } from "@/features/tasks/hooks";
import {
  useWorkspaceId,
  useFetchWorkspaceAnalytics,
} from "@/features/workspaces/hooks";
import { useFetchMembers } from "@/features/members/hooks";
import MemberAvatar from "@/features/members/components/member-avatar";
import { useCreateTaskModal } from "@/providers/task-modal-provider";
import { Badge } from "@/components/ui/badge";
import { STATUS } from "@/features/tasks/tasks.types";
import ErrorCard from "@/components/error";

export default function WorkspaceIdClient() {
  return (
    <div className="h-full w-full p-4 flex flex-col space-y-4">
      <WorkspaceAnalytics />
      <div className="flex h-full max-md:flex-col-reverse w-full gap-2">
        <div className="flex w-full md:w-1/2 gap-2 flex-col">
          <Projects />
          <Members />
        </div>
        <div className="w-full md:w-1/2">
          <TaskList />
        </div>
      </div>
    </div>
  );
}

// Workspace Analytics
function WorkspaceAnalytics() {
  const workspaceId = useWorkspaceId();
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useFetchWorkspaceAnalytics(workspaceId);

  if (isLoading) return <AnalyticsSkeleton />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!analytics) return null;

  return <Analytics data={analytics} />;
}

// Tasks
function TaskList() {
  const workspaceId = useWorkspaceId();
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useFetchTasks({
    workspaceId,
    notStatus: STATUS.DONE,
  });
  const { openModal } = useCreateTaskModal();

  if (isLoading) return <Skeleton variant="tasks" />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!tasks) return null;

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">Tasks ({tasks.total})</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/workspaces/${workspaceId}/tasks`}>
                <ExternalLinkIcon className="size-4" />
                <span className="hidden md:block">&nbsp;View All</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => openModal()}>
              <PlusIcon className="size-4" />
              <span className="hidden md:block">&nbsp;New Task</span>
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <ScrollArea className="border">
          <ul className="flex flex-col max-h-96">
            {tasks.documents.map((task) => (
              <li key={task.$id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="shadow-none rounded-none md:rounded-none hover:shadow-sm hover:bg-foreground/5  transition">
                    <CardContent className="flex items-start justify-between px-4 py-2 space-y-2">
                      <div className="flex flex-col">
                        <p className="text-base font-medium truncate">
                          {task.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground gap-x-1">
                          <ProjectAvatar
                            name={task.project.name}
                            image={task.project.image}
                            size={5}
                            className="text-[10px]"
                          />
                          <p>{task.project.name}</p>
                          <div className="size-1 mx-1 bg-muted-foreground rounded-full" />
                          <CalendarIcon className="size-4" />
                          <span className="truncate">
                            {formatDistanceToNow(task.dueDate)}
                          </span>
                        </div>
                      </div>
                      <Badge variant={task.status}>{task.status}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
            <li className="text-sm text-muted-foreground text-center hidden first-of-type:block my-2">
              No Tasks.
            </li>
          </ul>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

// Projects
function Projects() {
  const workspaceId = useWorkspaceId();
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useFetchProjects(workspaceId);
  const { openModal } = useProjectModal();

  if (isLoading) return <Skeleton variant="projects" />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!projects) return null;

  return (
    <div className="flex h-full flex-col gap-y-4 col-span-1">
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">Projects ({projects.total})</p>
          <Button variant="outline" size="sm" onClick={openModal}>
            <PlusIcon className="size-4" />
            <span className="hidden md:block">&nbsp;New Project</span>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2">
          {projects.documents.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none hover:shadow-sm hover:bg-foreground/5  transition">
                  <CardContent className="p-4 flex items-center gap-2">
                    <ProjectAvatar
                      name={project.name}
                      image={project.image}
                      size={8}
                    />
                    <div className="flex flex-col">
                      <p className="text-base font-medium truncate">
                        {project.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        created{" "}
                        {formatDistanceToNowStrict(project.$createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block my-2">
            No Projects.
          </li>
        </ul>
      </div>
    </div>
  );
}

// Members
function Members() {
  const workspaceId = useWorkspaceId();
  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useFetchMembers(workspaceId);

  if (isLoading) return <Skeleton variant="members" />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!members) return null;

  return (
    <div className="flex h-full flex-col gap-y-4 col-span-1">
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">Members ({members.total})</p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <ExternalLinkIcon className="size-4" />
              <span className="hidden md:block">&nbsp;View All</span>
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {members.documents.map((member) => (
            <li key={member.$id}>
              <Card className="bg-secondary rounded-lg shadow-none">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <MemberAvatar
                    name={member.name}
                    className="size-8 mb-2"
                    fallbackClass="bg-background"
                  />
                  <p className="text-base font-medium truncate">
                    {member.name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {member.email}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block my-2">
            No Projects.
          </li>
        </ul>
      </div>
    </div>
  );
}

type TSkellyVariant = {
  [key in "members" | "projects" | "tasks"]: React.ReactNode;
};
const SkellyVariant: TSkellyVariant = {
  members: (
    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 py-4 gap-2 border-t">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-md flex flex-col border items-center gap-1"
        >
          <Skelly className="size-8 rounded-full mb-2" />
          <Skelly className="h-5 w-24 rounded-full" />
          <Skelly className="h-4 w-20 rounded-full" />
        </div>
      ))}
    </div>
  ),
  projects: (
    <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 py-4 gap-2 border-t">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 rounded-md flex border items-center gap-2">
          <Skelly className="size-8 rounded-full" />
          <div className="flex flex-col gap-y-1">
            <Skelly className="h-5 w-20 lg:w-40 rounded-full" />
            <Skelly className="h-4 w-10 lg:w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  ),
  tasks: (
    <div className="border">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col px-4 py-3 gap-2 border">
          <Skelly className="h-5 w-40 rounded-full" />
          <div className="flex items-center gap-2">
            <Skelly className="size-5 rounded-full" />
            <Skelly className="h-4 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  ),
};

function Skeleton({ variant }: { variant: keyof TSkellyVariant }) {
  return (
    <div className="flex h-full flex-col gap-y-4 col-span-1">
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Skelly className="w-32 h-6" />
          <div className="flex gap-2">
            {variant === "tasks" && <Skelly className="h-8 w-8 md:w-20" />}
            <Skelly className="h-8 w-8 md:w-20" />
          </div>
        </div>
        <div className="my-4" />
        {SkellyVariant[variant]}
      </div>
    </div>
  );
}

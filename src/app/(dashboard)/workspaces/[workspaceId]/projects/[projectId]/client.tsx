"use client";

import { PencilIcon, PlusIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";

import Analytics, { AnalyticsSkeleton } from "@/components/analytics";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import {
  useFetchProjectAnalytics,
  useFetchProjectById,
  useProjectId,
} from "@/features/projects/hooks";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useCreateTaskModal } from "@/providers/task-modal-provider";
import ErrorCard from "@/components/error";

export default function ProjectIdClient() {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { openModal } = useCreateTaskModal();

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useFetchProjectById(projectId);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!project) return null;

  const projectSettingsHref = `/workspaces/${workspaceId}/projects/${projectId}/settings`;

  return (
    <div className="flex flex-col gap-y-4 p-4 w-full">
      <div className="flex max-md:px-2 w-full">
        <div className="flex grow items-center gap-x-2">
          <ProjectAvatar name={project.name} image={project.image} size={8} />
          <p className="text-lg font-semibold truncate">{project.name}</p>
        </div>

        <div className="flex gap-x-2">
          <Button asChild variant="outline" size="sm">
            <Link href={projectSettingsHref}>
              <PencilIcon className="size-4" />
              <span className="hidden md:block">&nbsp;Edit</span>
            </Link>
          </Button>
          <Button onClick={() => openModal()} variant="primary" size="sm">
            <PlusIcon className="size-4" />
            <span className="hidden md:block">&nbsp;New</span>
          </Button>
        </div>
      </div>
      <ProjectAnalytics />
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}

function ProjectAnalytics() {
  const projectId = useProjectId();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useFetchProjectAnalytics(projectId);

  if (isLoadingAnalytics) return <AnalyticsSkeleton />;
  if (!analytics) return <div>No analytics data</div>;

  return <Analytics data={analytics} />;
}

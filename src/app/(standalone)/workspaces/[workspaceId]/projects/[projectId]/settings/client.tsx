"use client";
import { TitleCard } from "@/components/cards/title-card";
import ErrorPage from "@/components/error";
import Loader from "@/components/loader";
import {
  ProjectDeleteCard,
  ProjectEditCard,
} from "@/features/projects/components/cards";
import { useFetchProjectById, useProjectId } from "@/features/projects/hooks";

export default function ProjectSettingsClient() {
  const projectId = useProjectId();
  const { data: project, isLoading } = useFetchProjectById(projectId);

  if (isLoading) return <Loader />;
  if (!project) return <ErrorPage message="Project not found" />;

  return (
    <div className="w-full sm:max-w-md md:max-w-lg mx-auto flex flex-col gap-y-2 md:gap-y-4">
      <TitleCard title="Project Settings" forceShow />
      <ProjectEditCard project={project} />
      <ProjectDeleteCard />
    </div>
  );
}

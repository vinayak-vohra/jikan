import { redirect } from "next/navigation";

import ProjectIdClient from "./client";

import { getCurrentUser } from "@/features/auth/services";
import { getProjectById } from "@/features/projects/services/get-project-by-id";

interface ProjectIdProps {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

export default async function ProjectIdPage({ params }: ProjectIdProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const project = await getProjectById(params.projectId, user);
  if (!project) redirect(`/workspaces/${params.workspaceId}`);

  return <ProjectIdClient />;
}

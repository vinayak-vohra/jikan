import { getCurrentUser } from "@/features/auth/services";
import { redirect } from "next/navigation";
import ProjectSettingsClient from "./client";
import { getProjectById } from "@/features/projects/services/get-project-by-id";

interface ProjectSettingsProps {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const project = await getProjectById(params.projectId, user);
  if (!project) redirect(`/workspaces/${params.workspaceId}`);

  return <ProjectSettingsClient />;
}

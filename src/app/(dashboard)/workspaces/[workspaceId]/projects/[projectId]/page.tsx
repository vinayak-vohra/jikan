import { PencilIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/services";
import { getProjectById } from "@/features/projects/services/get-project-by-id";
import ProjectAvatar from "@/features/projects/components/project-avatar";

interface Props {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

export default async function ProjectIdPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const project = await getProjectById(params.projectId);
  if (!project) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={project.name} image={project.image} size={8} />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm">
            <PencilIcon className="size-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

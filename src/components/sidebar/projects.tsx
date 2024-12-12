"use client";
import { CirclePlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import SidebarSkeleton from "./sidebar-skeleton";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { cn } from "@/lib/utils";
import { useFetchProjects, useProjectModal } from "@/features/projects/hooks";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks";

export default function Projects() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading } = useFetchProjects(workspaceId);
  const { openModal } = useProjectModal();

  if (isLoading) return <SidebarSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between text-neutral-500">
        <p className="text-sm font-semibold">Projects</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={openModal}>
              <CirclePlusIcon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Project</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {!projects && <span className="text-destructive text-center">Failed to fetch</span>}
      {projects?.total === 0 && (
        <p className="text-muted-foreground text-sm">No projects found</p>
      )}
      {projects?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link
            href={href}
            key={project.$id}
            className="w-full h-8 mb-2 rounded-md"
          >
            <div
              className={cn(
                "flex items-center gap-2.5 p-2 rounded-md transition cursor-pointer text-muted-foreground hover:text-primary",
                isActive && "bg-accent shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={project.name} image={project.image} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

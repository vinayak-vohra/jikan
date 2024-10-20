"use client";

import { CirclePlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import SidebarSkeleton from "./sidebar-skeleton";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  useFetchWorkspaces,
  useWorkspaceId,
  useWorkspaceModal,
} from "@/features/workspaces/hooks";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";

export default function WorkspaceSwitcher() {
  const currentWorkspaceId = useWorkspaceId();
  const router = useRouter();
  const { openModal } = useWorkspaceModal();
  const { data: workspaces, isLoading } = useFetchWorkspaces();

  const onSelect = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  if (isLoading) return <SidebarSkeleton />;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between text-neutral-500">
        <p className="text-sm font-semibold">Workspaces</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={openModal}>
              <CirclePlusIcon className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Workspace</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Select onValueChange={onSelect} value={currentWorkspaceId}>
        <SelectTrigger className="w-full bg-accent font-medium px-3">
          <SelectValue placeholder="No Workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex max-w-[180px] items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.image}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

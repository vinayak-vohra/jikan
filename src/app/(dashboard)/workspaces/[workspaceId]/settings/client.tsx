"use client";
import { TitleCard } from "@/components/cards/title-card";
import ErrorCard from "@/components/error";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  WorkspaceDeleteCard,
  WorkspaceEditCard,
  WorkspaceInviteCodeCard,
} from "@/features/workspaces/components/cards";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useFetchWorkspaceById } from "@/features/workspaces/hooks";
import { RotateCwIcon } from "lucide-react";

export default function WorkspaceSettingsClient() {
  const workspaceId = useWorkspaceId();
  const {
    data: currentWorkspace,
    isLoading,
    error,
    refetch,
  } = useFetchWorkspaceById(workspaceId);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorCard
        title={error.title}
        message={error.message}
        refetch={refetch}
      />
    );
  if (!currentWorkspace) return null;

  return (
    <div className="w-full sm:max-w-md md:max-w-lg mx-auto flex flex-col gap-y-2 md:gap-y-4">
      <TitleCard title="Workspace Settings" />
      <WorkspaceEditCard workspace={currentWorkspace} />
      <WorkspaceInviteCodeCard inviteCode={currentWorkspace.inviteCode} />
      <WorkspaceDeleteCard />
    </div>
  );
}

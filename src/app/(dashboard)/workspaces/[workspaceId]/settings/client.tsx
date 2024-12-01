"use client";
import { TitleCard } from "@/components/cards/title-card";
import ErrorPage from "@/components/error";
import Loader from "@/components/loader";
import {
  WorkspaceDeleteCard,
  WorkspaceEditCard,
  WorkspaceInviteCodeCard,
} from "@/features/workspaces/components/cards";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useFetchWorkspaceById } from "@/features/workspaces/hooks/use-fetch-workspace-by-id";

export default function WorkspaceSettingsClient() {
  const workspaceId = useWorkspaceId();
  const { data: currentWorkspace, isLoading } =
    useFetchWorkspaceById(workspaceId);

  if (isLoading) return <Loader />;
  if (!currentWorkspace) return <ErrorPage message="Workspace not found" />;

  return (
    <div className="w-full sm:max-w-md md:max-w-lg mx-auto flex flex-col gap-y-2 md:gap-y-4">
      <TitleCard title="Workspace Settings" />
      <WorkspaceEditCard workspace={currentWorkspace} />
      <WorkspaceInviteCodeCard inviteCode={currentWorkspace.inviteCode} />
      <WorkspaceDeleteCard />
    </div>
  );
}

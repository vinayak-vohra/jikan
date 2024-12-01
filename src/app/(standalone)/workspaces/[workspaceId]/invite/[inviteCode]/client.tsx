"use client";
import { TitleCard } from "@/components/cards/title-card";
import ErrorPage from "@/components/error";
import Loader from "@/components/loader";
import { WorkspaceJoinCard } from "@/features/workspaces/components/cards";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useFetchWorkspaceInfo } from "@/features/workspaces/hooks/use-fetch-workspace-info";

export default function InviteClient() {
  const workspaceId = useWorkspaceId();
  const { data: currentWorkspace, isLoading } =
    useFetchWorkspaceInfo(workspaceId);

  if (isLoading) return <Loader />;
  if (!currentWorkspace) return <ErrorPage message="Workspace not found" />;

  return (
    <div className="w-full md:max-w-lg flex flex-col gap-y-1 md:gap-y-4">
      <TitleCard title={currentWorkspace.name} />
      <WorkspaceJoinCard workspace={currentWorkspace} />
    </div>
  );
}

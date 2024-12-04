"use client";
import { TitleCard } from "@/components/cards/title-card";
import ErrorPage from "@/components/error";
import Loader from "@/components/loader";
import { WorkspaceJoinCard } from "@/features/workspaces/components/cards";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useFetchWorkspaceInfo } from "@/features/workspaces/hooks";

export default function InviteClient() {
  const workspaceId = useWorkspaceId();
  const { data: currentWorkspace, isLoading } =
    useFetchWorkspaceInfo(workspaceId);

  if (isLoading) return <Loader />;
  if (!currentWorkspace) return <ErrorPage message="Workspace not found" />;

  return (
    <>
      <TitleCard title={currentWorkspace.name} />
      <WorkspaceJoinCard workspace={currentWorkspace} />
    </>
  );
}

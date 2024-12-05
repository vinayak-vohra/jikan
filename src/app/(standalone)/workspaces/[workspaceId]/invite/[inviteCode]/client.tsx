"use client";
import { TitleCard } from "@/components/cards/title-card";
import ErrorCard from "@/components/error";
import Loader from "@/components/loader";
import { WorkspaceJoinCard } from "@/features/workspaces/components/cards";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { useFetchWorkspaceInfo } from "@/features/workspaces/hooks";

export default function InviteClient() {
  const workspaceId = useWorkspaceId();
  const {
    data: currentWorkspace,
    isLoading,
    error,
  } = useFetchWorkspaceInfo(workspaceId);

  if (isLoading) return <Loader />;
  if (error) return <ErrorCard title={error.title} message={error.message} />;
  if (!currentWorkspace) return null;

  return (
    <>
      <TitleCard title={currentWorkspace.name} />
      <WorkspaceJoinCard workspace={currentWorkspace} />
    </>
  );
}

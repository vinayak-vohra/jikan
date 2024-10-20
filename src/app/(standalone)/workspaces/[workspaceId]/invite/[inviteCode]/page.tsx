import { redirect } from "next/navigation";

import { TitleCard } from "@/components/cards/title-card";
import { getCurrentUser } from "@/features/auth/services";
import { getWorkspacePublicInfo } from "@/features/workspaces/services";
import { WorkspaceJoinCard } from "@/features/workspaces/components/cards";

interface WorkspaceJoinProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

export default async function JoinPage({ params }: WorkspaceJoinProps) {
  const user = await getCurrentUser();
  if (!user)
    redirect(
      `/sign-in?next=${encodeURIComponent(
        `/workspaces/${params.workspaceId}/invite/${params.inviteCode}`
      )}`
    );

  const currentWorkspace = await getWorkspacePublicInfo(params.workspaceId);

  if (!currentWorkspace) redirect("/");

  return (
    <div className="w-full md:max-w-lg flex flex-col gap-y-1 md:gap-y-4">
      <TitleCard title={currentWorkspace.name} />
      <WorkspaceJoinCard workspace={currentWorkspace} />
    </div>
  );
}

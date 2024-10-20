import { redirect } from "next/navigation";

import { TitleCard } from "@/components/cards/title-card";
import { getCurrentUser } from "@/features/auth/services";
import { getWorkspaceById } from "@/features/workspaces/services";
import {
  WorkspaceDeleteCard,
  WorkspaceEditCard,
  WorkspaceInviteCodeCard,
} from "@/features/workspaces/components/cards";

interface WorkspaceSettingsProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceIdSettingsPage({
  params: { workspaceId },
}: WorkspaceSettingsProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const currentWorkspace = await getWorkspaceById(workspaceId);

  if (!currentWorkspace) redirect("/");

  return (
    <div className="w-full sm:max-w-md md:max-w-lg mx-auto flex flex-col gap-y-1 md:gap-y-4">
      <TitleCard title="Settings" />
      <WorkspaceEditCard workspace={currentWorkspace} />
      <WorkspaceInviteCodeCard inviteCode={currentWorkspace.inviteCode} />
      <WorkspaceDeleteCard />
    </div>
  );
}

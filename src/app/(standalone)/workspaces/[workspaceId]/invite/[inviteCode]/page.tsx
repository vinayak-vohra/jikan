import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";

import InviteClient from "./client";
import { getWorkspaceById } from "@/features/workspaces/services";
import ErrorCard from "@/components/error";

interface JoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  // redirect(
  //   `/sign-in?next=${encodeURIComponent(
  //     `/workspaces/${params.workspaceId}/invite/${params.inviteCode}`
  //   )}`
  // );

  const workspace = await getWorkspaceById(params.workspaceId);
  if (!workspace) redirect("/");

  if (workspace.inviteCode !== params.inviteCode)
    return (
      <ErrorCard
        title="Invalid invite code"
        message="The invite code you provided is invalid. Please check the link and try again."
      />
    );

  return (
    <div className="py-5 flex flex-col items-center justify-evenly gap-5 w-full md:gap-0 md:max-w-5xl">
      <InviteClient />
    </div>
  );
}

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";

import InviteClient from "./client";

export default async function JoinPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  // redirect(
  //   `/sign-in?next=${encodeURIComponent(
  //     `/workspaces/${params.workspaceId}/invite/${params.inviteCode}`
  //   )}`
  // );

  return (
    <div className="py-5 flex flex-col items-center justify-evenly gap-5 w-full md:gap-0 md:max-w-5xl">
      <InviteClient />
    </div>
  );
}

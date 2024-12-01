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

  return <InviteClient />;
}

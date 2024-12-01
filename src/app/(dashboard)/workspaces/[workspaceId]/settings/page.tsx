import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";
import WorkspaceSettingsClient from "./client";

export default async function WorkspaceIdSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceSettingsClient />;
}

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";
import { getUserWorkspaces } from "@/features/workspaces/services";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspaces = await getUserWorkspaces();

  // No workspaces, create new
  if (!workspaces.total) {
    redirect("/workspaces/create");
  }
  // redirect to the most recent workspace
  else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}

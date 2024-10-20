import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";
import { getWorkspaceById } from "@/features/workspaces/services";

interface WorkspaceIdProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceIdPage(props: WorkspaceIdProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { workspaceId } = props.params;

  const currentWorkspace = await getWorkspaceById(workspaceId);

  if (!currentWorkspace) redirect("/");

  return <div>{currentWorkspace.name}</div>;
}

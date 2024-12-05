import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { searchUserInWorkspace } from "@/features/members/services";
import { createSessionClient } from "@/lib/appwrite";
import { IWorkspace } from "@/features/workspaces/workspaces.types";

export async function getWorkspaceById(workspaceId: string) {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      workspaceId
    );
    const workspace = await databases.getDocument<IWorkspace>(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      workspaceId
    );

    if (!member || !workspace) return null;

    return workspace;
  } catch {
    return null;
  }
}

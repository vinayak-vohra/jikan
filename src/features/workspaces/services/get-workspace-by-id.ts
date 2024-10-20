import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { searchUserInWorkspace } from "@/features/members/services";
import { createSessionClient } from "@/lib/appwrite";
import { IWorkspace } from "@/features/workspaces/workspaces.types";

/**
 * Retrieves a workspace by its ID.
 *
 * @param workspaceId - The ID of the workspace to retrieve.
 * @returns The workspace document if found and the user is a member, otherwise null.
 */
export async function getWorkspaceById(workspaceId: string) {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const member = await searchUserInWorkspace(databases, user.$id, workspaceId);

  const workspace = await databases.getDocument<IWorkspace>(
    DATABASE_ID,
    COLLECTIONS.WORKSPACES_ID,
    workspaceId
  );

  if (!member || !workspace) return null;

  return workspace;
}

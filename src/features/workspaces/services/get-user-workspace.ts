import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { createSessionClient } from "@/lib/appwrite";
import { Query, type Models } from "node-appwrite";

type DocumentList = Models.DocumentList<Models.Document>;

/**
 * This function fetches all the workspaces associated with the authenticated user
 * from the database.
 *
 * @returns A promise that resolves to a list of documents representing the
 * workspaces the user is a member of.
 */
export async function getUserWorkspaces(): Promise<DocumentList> {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    // List current user workspaces
    const members = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    );

    // no workspaces
    if (!members.total) {
      return { documents: [], total: 0 };
    }

    // get workspace ids
    const workspaceIds = members.documents.map((record) => record.workspaceId);

    // get workspaces
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
}

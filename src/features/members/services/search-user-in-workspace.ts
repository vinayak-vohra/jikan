import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, COLLECTIONS } from "@/constants";
import { IMember } from "@/features/members/members.types";


/**
 * Searches for a user in a specific workspace.
 *
 * @param db - The database instance to use for querying.
 * @param userId - The ID of the user to search for.
 * @param workspaceId - The ID of the workspace to search within.
 * @returns A promise that resolves to the document of the user if found, or null if not found.
 */
export async function searchUserInWorkspace(
  db: Databases,
  userId: string,
  workspaceId: string
): Promise<IMember | null> {
  const docs = await db.listDocuments<IMember>(DATABASE_ID, COLLECTIONS.MEMBERS_ID, [
    Query.equal("userId", userId),
    Query.equal("workspaceId", workspaceId),
  ]);

  if (docs.total !== 1) return null;

  return docs.documents[0];
}

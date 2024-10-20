import "server-only";
import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { createAdminClient } from "@/lib/appwrite";
import { MemberRoles } from "@/features/members/members.types";
import { IWorkspace } from "@/features/workspaces/workspaces.types";
import { Models, Query } from "node-appwrite";

export type IWorkspacePublicInfo = Pick<IWorkspace, "name" | "image"> & {
  admin: Pick<Models.User<Models.Preferences>, "name">;
};

/**
 * Retrieves the public information of a workspace, including the name, image, and the admin user.
 *
 * @param workspaceId The unique identifier of the workspace.
 * @returns The public information of the workspace.
 */
export async function getWorkspacePublicInfo(
  workspaceId: string
): Promise<IWorkspacePublicInfo | null> {
  const { databases, users } = await createAdminClient();

  // Retrieve the workspace document from the database
  const workspace = await databases.getDocument<IWorkspace>(
    DATABASE_ID,
    COLLECTIONS.WORKSPACES_ID,
    workspaceId
  );

  // Retrieve Workspace admin document
  const docs = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.MEMBERS_ID,
    [
      Query.equal("workspaceId", workspaceId),
      Query.equal("role", MemberRoles.ADMIN),
    ]
  );

  // If the admin document does not exist, return null
  if (!docs.total) return null;

  const adminId = docs.documents[0].userId;

  // Retrieve the admin user document from the database
  const admin = await users.get(adminId);

  // If the admin user document does not exist, return null
  if (!admin) return null;

  // Return the public information of the workspace
  return { ...workspace, admin } as IWorkspacePublicInfo;
}

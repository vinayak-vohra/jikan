import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { createSessionClient } from "@/lib/appwrite";
import { IWorkspace } from "../workspaces.types";

export async function verifyInviteCode(
  inviteCode: string,
  workspaceId: string
) {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<IWorkspace>(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      workspaceId
    );

    if (workspace.inviteCode !== inviteCode) return false;

    return true;
  } catch {
    return false;
  }
}

import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { searchUserInWorkspace } from "@/features/members/services";
import { createSessionClient } from "@/lib/appwrite";
import { IProject } from "@/features/projects/projects.types";

/**
 * Retrieves a project by its ID.
 *
 * @param projectId - The ID of the project to retrieve.
 * @returns The project document if found and the user is a member, otherwise null.
 */
export async function getProjectById(projectId: string) {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const project = await databases.getDocument<IProject>(
      DATABASE_ID,
      COLLECTIONS.PROJECTS_ID,
      projectId
    );

    if (!project) return null;

    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      project.workspaceId
    );

    if (!member) return null;

    return project;
  } catch {
    return null;
  }
}

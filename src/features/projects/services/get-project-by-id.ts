import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { searchUserInWorkspace } from "@/features/members/services";
import { createSessionClient } from "@/lib/appwrite";
import { IProject } from "@/features/projects/projects.types";
import { IUser } from "@/features/auth/auth.types";

export async function getProjectById(projectId: string, user: IUser) {
  try {
    const { databases } = await createSessionClient();

    const project = await databases.getDocument<IProject>(
      DATABASE_ID,
      COLLECTIONS.PROJECTS_ID,
      projectId
    );

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

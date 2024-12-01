import { Models } from "node-appwrite";
import { IUser } from "../auth/auth.types";

/**
 * Represents a workspace document in the database.
 * This interface extends the base `Models.Document` type to include
 * specific fields relevant to workspaces.
 *
 * @interface IWorkspace
 * @extends Models.Document
 *
 * @property {string} name - The name of the workspace.
 * @property {string} image - The URL or identifier of the workspace's image.
 * @property {string} inviteCode - The code used for inviting users to the workspace.
 */
export interface IWorkspace extends Models.Document {
  name: string;
  image: string;
  inviteCode: string;
}

export interface IWorkspacePublicInfo
  extends Pick<IWorkspace, "name" | "image"> {
  admin: Pick<IUser, "name">;
}

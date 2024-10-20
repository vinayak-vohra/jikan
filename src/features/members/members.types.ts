import { Models } from "node-appwrite";

export enum MemberRoles {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

/**
 * Interface representing a member of a workspace.
 * Extends the `Models.Document` interface provided by Appwrite to include 
 * additional fields related to the user's membership in a workspace.
 * 
 * @interface IMember
 * @extends Models.Document
 * 
 * @property {string} userId - The unique identifier for the user who is a member of the workspace.
 * @property {string} workspaceId - The unique identifier for the workspace to which the user belongs.
 * @property {MemberRoles} role - The role of the member in the workspace, typically 'admin' or 'member'.
 */
export interface IMember extends Models.Document {
  userId: string;
  workspaceId: string;
  role: MemberRoles;
}

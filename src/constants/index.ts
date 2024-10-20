export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!;
const WORKSPACES_ID = process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!;
const PROJECTS_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!;

export const COLLECTIONS = {
  WORKSPACES_ID,
  MEMBERS_ID,
  PROJECTS_ID,
};

export enum ERRORS {
  UNAUTHORIZED = "Unauthorized",
  MEMBER_NOT_FOUND = "Member not found",
  INSUFFICIENT_PERMISSIONS = "Need Admin permissions",
  REMOVE_LAST_MEMBER = "Cannot remove the last member",
  REMOVE_OWNER = "Cannot remove workspace owner",
  DEMOTE_OWNER = "Cannot demote workspace owner",
  DEMOTE_SELF = "Cannot demote yourself",
}

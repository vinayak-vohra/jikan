export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!;
const WORKSPACES_ID = process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!;
const PROJECTS_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!;
const TASKS_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!;

export const COLLECTIONS = {
  WORKSPACES_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
};

export enum ERRORS {
  UNAUTHORIZED = "Unauthorized",
  INTERNAL = "Internal Server Error",
  MEMBER_NOT_FOUND = "Member not found",
  PROJECT_NOT_FOUND = "Project not found",
  WORKSPACE_NOT_FOUND = "Workspace not found",
  INSUFFICIENT_PERMISSIONS = "Need Admin permissions",
  REMOVE_LAST_MEMBER = "Cannot remove the last member",
  REMOVE_OWNER = "Cannot remove workspace owner",
  DEMOTE_OWNER = "Cannot demote workspace owner",
  DEMOTE_SELF = "Cannot demote yourself",
  BULK_MULTIPLE_WORKSPACES = "Cannot update tasks in multiple workspaces",
  BULK_NO_WORKSPACES = "Task workspace not found",
}

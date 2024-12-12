import { Models } from "node-appwrite";
import { IProject } from "../projects/projects.types";
import { IMember } from "../members/members.types";
import { IUser } from "../auth/auth.types";

export enum STATUS {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export const StatusColors: Record<STATUS, string> = {
  [STATUS.BACKLOG]: "red",
  [STATUS.TODO]: "indigo",
  [STATUS.IN_PROGRESS]: "purple",
  [STATUS.IN_REVIEW]: "yellow",
  [STATUS.DONE]: "green",
};

export interface ITask extends Models.Document {
  workspaceId: string;
  projectId: string;
  name: string;
  description?: string;
  assigneeId: string;
  status: STATUS;
  dueDate: Date | string;
  position: number;
}

export interface ITaskPopulated extends ITask {
  project: IProject;
  assignee: IMember & Pick<IUser, "name" | "email">;
}

export type TaskUpdatePayload = Pick<ITask, "$id" | "status" | "position">;

export interface TaskFilters {
  workspaceId: string;
  projectId?: string;
  status?: STATUS | STATUS[];
  notStatus?: STATUS | STATUS[];
  search?: string;
  assigneeId?: string;
  duDate?: string;
}

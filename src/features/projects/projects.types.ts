import { type Models } from "node-appwrite";

export interface IProject extends Models.Document {
  name: string;
  image: string;
  workspaceId: string;
}

export type ProjectOptions = Pick<IProject, "$id" | "name" | "image">;

export type IAnalytics = {
  [K in "task" | "assigned" | "complete" | "incomplete" | "overdue"]: {
    count: number;
    difference: number;
  };
};

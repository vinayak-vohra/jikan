import { type Models } from "node-appwrite";

export interface IProject extends Models.Document {
  name: string;
  image: string;
  workspaceId: string;
}

export type ProjectOptions = Pick<IProject, "$id" | "name" | "image">;


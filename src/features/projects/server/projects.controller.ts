import { COLLECTIONS, DATABASE_ID } from "@/constants";
import { sessionMiddleware } from "@/features/auth/server/session.middleware";
import { searchUserInWorkspace } from "@/features/members/services";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../projects.schemas";
import { getImageString } from "@/features/workspaces/services";
import { MemberRoles } from "@/features/members/members.types";
import { IProject } from "../projects.types";

const app = new Hono()

  // Fetch projects in a workspace
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        workspaceId
      );

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const projects = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: projects });
    }
  )

  // Create a project in a workspace
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        workspaceId
      );

      if (!member || member.role !== MemberRoles.ADMIN)
        return c.json({ error: "Unauthorized" }, 401);

      // create new document in projects collection
      const project = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        ID.unique(),
        {
          name,
          image: await getImageString(storage, image),
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )

  // Update a project in a workspace
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const storage = c.get("storage");
        const databases = c.get("databases");

        const { projectId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const currentProject = await databases.getDocument<IProject>(
          DATABASE_ID,
          COLLECTIONS.PROJECTS_ID,
          projectId
        );

        // check if user is a member of the workspace
        const member = await searchUserInWorkspace(
          databases,
          user.$id,
          currentProject.workspaceId
        );

        if (!member) throw new Error("Unauthorized");

        // update project
        const project = await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.PROJECTS_ID,
          projectId,
          {
            name,
            image: await getImageString(storage, image),
          }
        );

        return c.json({ data: project });
      } catch (error: any) {
        return c.json({ error: "Internal Server Error" }, 400);
      }
    }
  );

export default app;

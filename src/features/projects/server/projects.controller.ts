import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { COLLECTIONS, DATABASE_ID, ERRORS } from "@/constants";
import { sessionMiddleware } from "@/features/auth/server/session.middleware";
import { MemberRoles } from "@/features/members/members.types";
import { searchUserInWorkspace } from "@/features/members/services";
import { getImageString } from "@/features/workspaces/services";

import { createProjectSchema, updateProjectSchema } from "../projects.schemas";
import { IProject } from "../projects.types";
import { ITask, STATUS } from "@/features/tasks/tasks.types";
import { IAnalytics } from "@/types/global.types";
import {
  APIException,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/exception";
import { HTTPException } from "hono/http-exception";

const app = new Hono()

  // Fetch projects in a workspace
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");

        const { workspaceId } = c.req.valid("query");

        const member = await searchUserInWorkspace(
          databases,
          user.$id,
          workspaceId
        );

        if (!member) throw new UnauthorizedError();

        const projects = await databases.listDocuments<IProject>(
          DATABASE_ID,
          COLLECTIONS.PROJECTS_ID,
          [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("$createdAt"),
          ]
        );

        return c.json({ data: projects });
      } catch (error: unknown) {
        if (error instanceof HTTPException) throw error;
        throw new APIException(error);
      }
    }
  )

  // Fetch project by id
  .get("/:projectId", sessionMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const databases = c.get("databases");

      const { projectId } = c.req.param();

      const project = await databases.getDocument<IProject>(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        projectId
      );

      if (!project) throw new NotFoundError("Project Not Found");

      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        project.workspaceId
      );

      if (!member) throw new UnauthorizedError();

      return c.json({ data: project });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  })

  // Create a project in a workspace
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const storage = c.get("storage");

        const { name, image, workspaceId } = c.req.valid("form");

        // find current user in workspace
        const member = await searchUserInWorkspace(
          databases,
          user.$id,
          workspaceId
        );

        // check if user is a member of the workspace and is an admin
        if (!member) throw new UnauthorizedError();

        if (member.role !== MemberRoles.ADMIN)
          throw new UnauthorizedError("Need Admin Privileges");

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
      } catch (error: unknown) {
        if (error instanceof HTTPException) throw error;
        throw new APIException(error);
      }
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

        // get project info
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

        if (!member) throw new UnauthorizedError();

        if (member.role !== MemberRoles.ADMIN)
          throw new UnauthorizedError("Need Admin Privileges");

        // update project
        const project = await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.PROJECTS_ID,
          projectId,
          {
            name,
            image: (await getImageString(storage, image)) ?? null,
          }
        );

        return c.json({ data: project });
      } catch (error: unknown) {
        if (error instanceof HTTPException) throw error;
        throw new APIException(error);
      }
    }
  )

  // Delete a project in a workspace
  .delete("/:projectId", sessionMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const databases = c.get("databases");

      const { projectId } = c.req.param();

      // get project info
      const project = await databases.getDocument<IProject>(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        projectId
      );

      // get member info
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        project.workspaceId
      );

      if (!member) throw new UnauthorizedError();

      if (member.role !== MemberRoles.ADMIN)
        throw new UnauthorizedError("Need Admin Privileges");

      // get all tasks in the project
      const tasks = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [Query.equal("projectId", projectId)]
      );

      // delete tasks
      await Promise.all(
        tasks.documents.map(async (task) =>
          databases.deleteDocument(DATABASE_ID, COLLECTIONS.TASKS_ID, task.$id)
        )
      );

      // delete project
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        projectId
      );

      return c.json({ data: { $id: projectId, tasksDeleted: tasks.total } });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  })

  // Get project analytics
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const databases = c.get("databases");

      const { projectId } = c.req.param();

      // get project info
      const project = await databases.getDocument<IProject>(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        projectId
      );

      // get member info
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        project.workspaceId
      );

      if (!member) throw new UnauthorizedError();

      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);

      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const currentMonthTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
        ]
      );

      const lastMonthTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const taskCount = currentMonthTasks.total;
      const taskDifference = currentMonthTasks.total - lastMonthTasks.total;

      const currentMonthAssignedTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
        ]
      );

      const lastMonthAssignedTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const assignedTaskCount = currentMonthAssignedTasks.total;
      const assignedTaskDifference =
        currentMonthAssignedTasks.total - lastMonthAssignedTasks.total;

      const currentMonthIncompleteTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", STATUS.DONE),
          Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
        ]
      );

      const lastMonthIncompleteTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", STATUS.DONE),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const incompleteTaskCount = currentMonthIncompleteTasks.total;
      const incompleteTaskDifference =
        currentMonthIncompleteTasks.total - lastMonthIncompleteTasks.total;

      const currentMonthCompleteTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("status", STATUS.DONE),
          Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
        ]
      );

      const lastMonthCompleteTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("status", STATUS.DONE),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const completeTaskCount = currentMonthCompleteTasks.total;
      const completeTaskDifference =
        currentMonthCompleteTasks.total - lastMonthCompleteTasks.total;

      const currentMonthOverdueTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", STATUS.DONE),
          Query.lessThan("dueDate", now.toISOString()),
          Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
        ]
      );

      const lastMonthOverdueTasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", STATUS.DONE),
          Query.lessThan("dueDate", now.toISOString()),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const overdueTaskCount = currentMonthOverdueTasks.total;
      const overdueTaskDifference =
        currentMonthOverdueTasks.total - lastMonthOverdueTasks.total;

      return c.json({
        data: {
          task: {
            count: taskCount,
            difference: taskDifference,
          },

          assigned: {
            count: assignedTaskCount,
            difference: assignedTaskDifference,
          },

          incomplete: {
            count: incompleteTaskCount,
            difference: incompleteTaskDifference,
          },

          complete: {
            count: completeTaskCount,
            difference: completeTaskDifference,
          },

          overdue: {
            count: overdueTaskCount,
            difference: overdueTaskDifference,
          },
        } as IAnalytics,
      });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  });
export default app;

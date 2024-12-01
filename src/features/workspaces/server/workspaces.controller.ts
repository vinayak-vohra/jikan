import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { nanoid } from "nanoid";

import {
  createWorkSpaceSchema,
  updateWorkSpaceSchema,
} from "../workspaces.schemas";
import { getImageString } from "../services";

import { COLLECTIONS, DATABASE_ID, ERRORS } from "@/constants";
import { sessionMiddleware } from "@/features/auth/server/session.middleware";
import { searchUserInWorkspace } from "@/features/members/services/search-user-in-workspace";
import { MemberRoles } from "@/features/members/members.types";
import {
  IWorkspace,
  IWorkspacePublicInfo,
} from "@/features/workspaces/workspaces.types";
import { z } from "zod";
import { IUser } from "@/features/auth/auth.types";
import { createAdminClient } from "@/lib/appwrite";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { ITask, STATUS } from "@/features/tasks/tasks.types";
import { IAnalytics } from "@/features/projects/projects.types";
// import { endOfMonth, startOfMonth, subMonths } from "date-fns";

const app = new Hono()

  // Create a new Workspace
  .post(
    "/",
    zValidator("form", createWorkSpaceSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      // create new document in workspaces collection
      const workspace = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          image: await getImageString(storage, image),
          inviteCode: nanoid(10),
        }
      );

      // add an entry in members collection
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRoles.ADMIN,
        }
      );

      return c.json({ data: workspace });
    }
  )

  // Fetch user workspaces
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    // List current user workspaces
    const members = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    );

    // no workspaces
    if (!members.total) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    // get workspace ids
    const workspaceIds = members.documents.map((record) => record.workspaceId);

    // get workspaces
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })

  // Fetch workspace by id
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    // check if user is a member of the workspace
    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      workspaceId
    );

    if (!member) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

    // get workspace
    const workspace = await databases.getDocument<IWorkspace>(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      workspaceId
    );

    return c.json({ data: workspace });
  })

  // Fetch workspace public info
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { users } = await createAdminClient();

    const { workspaceId } = c.req.param();

    // get workspace
    const workspace = await databases.getDocument<IWorkspace>(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      workspaceId
    );

    if (!workspace) return c.json({ error: ERRORS.WORKSPACE_NOT_FOUND }, 404);

    // get admin info
    const admin = await users.get<IUser>(workspace.userId);

    return c.json({
      data: {
        name: workspace.name,
        image: workspace.image,
        admin: { name: admin.name },
      } as IWorkspacePublicInfo,
    });
  })

  // Update a workspace
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkSpaceSchema),
    async (c) => {
      const user = c.get("user");
      const storage = c.get("storage");
      const databases = c.get("databases");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      // check if user is a member of the workspace
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        workspaceId
      );

      // only admin can update workspace
      if (!member || member.role !== MemberRoles.ADMIN)
        throw new Error("Unauthorized");

      // update workspace
      const workspace = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES_ID,
        workspaceId,
        {
          name,
          image: (await getImageString(storage, image)) ?? null,
        }
      );

      return c.json({ data: workspace });
    }
  )

  // Delete a workspace
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    // check if user is a member of the workspace
    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      workspaceId
    );

    // only admin can delete workspace
    if (!member || member.role !== MemberRoles.ADMIN)
      throw new Error("Unauthorized");

    // delete workspace
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      workspaceId
    );

    return c.json({ data: { $id: workspaceId } });
  })

  // Reset invite code
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    // check if user is a member of the workspace
    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      workspaceId
    );

    // only admin can reset invite code
    if (!member || member.role !== MemberRoles.ADMIN)
      throw new Error("Unauthorized");

    // update workspace invite code
    const workspace = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: nanoid(10),
      }
    );
    return c.json({ data: workspace });
  })

  // Join a workspace
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ inviteCode: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { inviteCode } = c.req.valid("json");

      const user = c.get("user");
      const databases = c.get("databases");

      // check if user is a member of the workspace
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        workspaceId
      );

      // user is already a member of the workspace
      if (member) {
        return c.json(
          { error: "User is already a member of the workspace" },
          400
        );
      }

      // check if invite code is valid
      const workspace = await databases.getDocument<IWorkspace>(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== inviteCode) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      // add user to workspace
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId,
          role: MemberRoles.MEMBER,
        }
      );

      return c.json({ data: workspace });
    }
  )

  // Get project analytics
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    // get member info
    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      workspaceId
    );

    if (!member) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthTasks = await databases.listDocuments<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", STATUS.DONE),
        Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", STATUS.DONE),
        Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompleteTasks = await databases.listDocuments<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
  });
export default app;

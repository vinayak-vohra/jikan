import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { ITask, ITaskPopulated } from "../tasks.types";
import {
  bulkUpdateSchema,
  createTaskSchema,
  fetchTaskSchema,
} from "../tasks.schemas";

import { COLLECTIONS, DATABASE_ID, ERRORS } from "@/constants";
import { searchUserInWorkspace } from "@/features/members/services";
import { sessionMiddleware } from "@/features/auth/server/session.middleware";
import { createAdminClient } from "@/lib/appwrite";
import { IProject } from "@/features/projects/projects.types";
import { IMember } from "@/features/members/members.types";

const app = new Hono()
  // create new task
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const task = c.req.valid("json");

      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        task.workspaceId
      );

      if (!member) {
        return c.json({ error: ERRORS.UNAUTHORIZED }, 401);
      }

      // get highest position task
      const highestPositionTask = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.equal("workspaceId", task.workspaceId),
          Query.equal("status", task.status),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        (highestPositionTask.documents?.[0]?.position || 0) + 1000;

      const newtask = await databases.createDocument<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        ID.unique(),
        {
          ...task,
          position: newPosition,
        }
      );

      return c.json({ data: newtask });
    }
  )

  // get all tasks
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", fetchTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { users } = await createAdminClient();

      const filters = c.req.valid("query");

      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        filters.workspaceId
      );

      if (!member) {
        return c.json({ error: ERRORS.UNAUTHORIZED }, 401);
      }

      const query = [
        Query.equal("workspaceId", filters.workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      // Filter by projectId if provided
      if (filters.projectId) {
        query.push(Query.equal("projectId", filters.projectId));
      }

      // Filter by assigneeId if provided
      if (filters.assigneeId) {
        query.push(Query.equal("assigneeId", filters.assigneeId));
      }

      // Filter by status if provided
      if (filters.status) {
        query.push(Query.equal("status", filters.status));
      }

      // Search by name if search term is provided
      if (filters.search) {
        query.push(Query.search("name", filters.search));
      }

      // Filter by dueDate if provided
      if (filters.dueDate) {
        query.push(Query.equal("dueDate", filters.dueDate));
      }

      const tasks = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<IProject>(
        DATABASE_ID,
        COLLECTIONS.PROJECTS_ID,
        projectIds.length ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments<IMember>(
        DATABASE_ID,
        COLLECTIONS.MEMBERS_ID,
        assigneeIds.length ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name, email: user.email };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        if (!project) throw new Error("Project not found");

        const assignee = assignees.find(
          (member) => member.$id === task.assigneeId
        );
        if (!assignee) throw new Error("Assignee not found");

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          total: populatedTasks.length,
          documents: populatedTasks as ITaskPopulated[],
        },
      });
    }
  )

  // get task by id
  .get("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      taskId
    );

    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      task.workspaceId
    );

    if (!member) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

    const project = await databases.getDocument<IProject>(
      DATABASE_ID,
      COLLECTIONS.PROJECTS_ID,
      task.projectId
    );

    const assignee = await databases.getDocument<IMember>(
      DATABASE_ID,
      COLLECTIONS.MEMBERS_ID,
      task.assigneeId
    );

    // get assignee details
    const assigneeInfo = await users.get(assignee.userId);

    const populatedAssignee = {
      ...assignee,
      name: assigneeInfo.name,
      email: assigneeInfo.email,
    };

    return c.json({
      data: { ...task, project, assignee: populatedAssignee } as ITaskPopulated,
    });
  })

  // update task
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { name, status, description, assigneeId, projectId, dueDate } =
        c.req.valid("json");
      const { taskId } = c.req.param();

      // get task to update
      const taskToUpdate = await databases.getDocument<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        taskId
      );

      // check if user is a member of the workspace
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        taskToUpdate.workspaceId
      );

      // member not found
      if (!member) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

      // update task
      const updatedTask = await databases.updateDocument<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        taskId,
        { name, description, dueDate, status, assigneeId, projectId }
      );

      return c.json({ data: updatedTask });
    }
  )

  // delete task
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const taskId = c.req.param("taskId");

    const task = await databases.getDocument<ITask>(
      DATABASE_ID,
      COLLECTIONS.TASKS_ID,
      taskId
    );

    const member = await searchUserInWorkspace(
      databases,
      user.$id,
      task.workspaceId
    );

    if (!member) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TASKS_ID, taskId);

    return c.json({ data: { $id: taskId } });
  })

  // bulk update tasks
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator("json", bulkUpdateSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { tasks } = c.req.valid("json");

      // get workspaces of tasks to update
      const tasksToUpdate = await databases.listDocuments<ITask>(
        DATABASE_ID,
        COLLECTIONS.TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      // add tasks to a set to get unique workspaces
      const workspaces = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      // if tasks are in multiple workspaces, return error
      if (workspaces.size > 1) {
        return c.json({ error: ERRORS.BULK_MULTIPLE_WORKSPACES }, 401);
      }

      if (workspaces.size < 1) {
        return c.json({ error: ERRORS.BULK_NO_WORKSPACES }, 400);
      }

      // get workspace id
      const workspaceId = workspaces.values().next().value!;

      // check if user is a member of the workspace
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        workspaceId
      );

      // member not found
      if (!member) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

      // update tasks
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id: taskId, position, status } = task;

          return databases.updateDocument<ITask>(
            DATABASE_ID,
            COLLECTIONS.TASKS_ID,
            taskId,
            {
              status,
              position,
            }
          );
        })
      );

      return c.json({ data: updatedTasks });
    }
  );
export default app;

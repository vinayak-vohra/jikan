import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { sessionMiddleware } from "@/features/auth/server/session.middleware";
import { createAdminClient } from "@/lib/appwrite";
import { searchUserInWorkspace } from "../services";
import { COLLECTIONS, DATABASE_ID, ERRORS } from "@/constants";
import { Query } from "node-appwrite";
import { IMember, MemberRoles } from "@/features/members/members.types";
import { HTTPException } from "hono/http-exception";
import {
  APIException,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/exception";

const app = new Hono()

  // Fetch Workspace Members
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const databases = c.get("databases");
        const user = c.get("user");

        const { workspaceId } = c.req.valid("query");

        const member = await searchUserInWorkspace(
          databases,
          user.$id,
          workspaceId
        );

        // user not a member of the workspace
        if (!member) throw new UnauthorizedError();

        const members = await databases.listDocuments<IMember>(
          DATABASE_ID,
          COLLECTIONS.MEMBERS_ID,
          [Query.equal("workspaceId", workspaceId)]
        );

        const populatedMembers = await Promise.all(
          members.documents.map(async (member) => {
            const user = await users.get(member.userId);
            return {
              ...member,
              name: user.name,
              email: user.email,
            };
          })
        );
        return c.json({ data: { ...members, documents: populatedMembers } });
      } catch (error: unknown) {
        if (error instanceof HTTPException) throw error;
        throw new APIException(error);
      }
    }
  )

  // Delete Workspace Member
  .delete("/:memberId", sessionMiddleware, async (c) => {
    try {
      const { memberId } = c.req.param();
      const user = c.get("user");
      const databases = c.get("databases");

      // Fetch member to delete
      const memberToDelete = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.MEMBERS_ID,
        memberId
      );

      // Check if member exists
      if (!memberToDelete) throw new NotFoundError("Member not found");

      // Check if user is a member of the workspace
      const member = await searchUserInWorkspace(
        databases,
        user.$id,
        memberToDelete.workspaceId
      );

      // user not a member of the workspace
      if (!member) throw new UnauthorizedError();

      // Get workspace details
      const workspace = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.WORKSPACES_ID,
        memberToDelete.workspaceId
      );

      // Check if user is removing owner
      if (workspace.userId === memberToDelete.userId)
        throw new UnauthorizedError("Cannot remove workspace owner");

      // Check if user is deleting themselves or if they are an admin
      if (
        user.$id !== memberToDelete.userId &&
        member.role !== MemberRoles.ADMIN
      )
        throw new UnauthorizedError("Need Admin Privileges");

      // Fetch all members in the workspace
      // const allMembers = await databases.listDocuments(
      //   DATABASE_ID,
      //   COLLECTIONS.MEMBERS_ID,
      //   [Query.equal("workspaceId", memberToDelete.workspaceId)]
      // );

      // Check if the member to delete is the last member
      // if (allMembers.total === 1) {
      //   return c.json({ error: ERRORS.REMOVE_LAST_MEMBER }, 400);
      // }

      // Delete member
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.MEMBERS_ID,
        memberToDelete.$id
      );

      return c.json({ data: { $id: memberToDelete.$id } });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  })

  // Update Member Role
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRoles) })),
    async (c) => {
      try {
        const { memberId } = c.req.param();
        const user = c.get("user");
        const databases = c.get("databases");
        const { role } = c.req.valid("json");

        // Fetch member to update
        const memberToUpdate = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.MEMBERS_ID,
          memberId
        );

        // Check if member exists
        if (!memberToUpdate) throw new NotFoundError("Member not found");

        // Check if user is a member of the workspace
        const member = await searchUserInWorkspace(
          databases,
          user.$id,
          memberToUpdate.workspaceId
        );

        // user not a member of the workspace
        if (!member) throw new UnauthorizedError();

        // Get workspace details
        const workspace = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.WORKSPACES_ID,
          memberToUpdate.workspaceId
        );

        // Check if user is admin or not
        if (member.role !== MemberRoles.ADMIN)
          throw new UnauthorizedError("Need Admin Privileges");

        // Check if user is demoting workspace owner
        if (workspace.userId === memberToUpdate.userId)
          throw new UnauthorizedError("Cannot demote workspace owner");

        // Check if user is demoting themselves
        if (user.$id === memberToUpdate.userId)
          throw new UnauthorizedError("Cannot demote yourself");

        // Update member
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.MEMBERS_ID,
          memberToUpdate.$id,
          { role }
        );

        return c.json({ data: { $id: memberToUpdate.$id } });
      } catch (error: unknown) {
        if (error instanceof HTTPException) throw error;
        throw new APIException(error);
      }
    }
  );

export default app;

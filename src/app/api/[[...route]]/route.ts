import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/auth.controller";
import members from "@/features/members/server/members.controller";
import projects from "@/features/projects/server/projects.controller";
import workspaces from "@/features/workspaces/server/workspaces.controller";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app

  // authentication
  .route("/auth", auth)

  // workspace members
  .route("/members", members)

  // user workspaces
  .route("/workspaces", workspaces)

  // user projects
  .route("/projects", projects);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// client-server type safety
export type AppType = typeof routes;

import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
export const authApi = client.api.auth;
export const membersApi = client.api.members;
export const projectsApi = client.api.projects;
export const workspaceApi = client.api.workspaces;

import "server-only";

import {
  Account,
  Client,
  Databases,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { cookie } from "../auth.cookies";
import { ERRORS } from "@/constants";
import { IUser } from "../auth.types";

export type SessionContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: IUser;
  };
};

// middleware to get session details
export const sessionMiddleware = createMiddleware<SessionContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const session = getCookie(c, cookie.SESSION);

    if (!session) return c.json({ error: ERRORS.UNAUTHORIZED }, 401);

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    const user = await account.get();

    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("user", user);

    await next();
  }
);

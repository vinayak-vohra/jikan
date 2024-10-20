import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "./session.middleware";
import { cookie } from "../auth.cookies";
import { loginSchema, registerSchema } from "../auth.schemas";

import { createAdminClient } from "@/lib/appwrite";

const cookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 24 * 30,
};

// requests are chained to provide app wide type safety
const app = new Hono()

  // Handle Sign In request
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, cookie.SESSION, session.secret, cookieOptions);

    return c.json({ success: true });
  })

  // handle Sign Up request
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { email, name, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, cookie.SESSION, session.secret, cookieOptions);

    return c.json({ success: true });
  })

  // get current user details
  .get("/current", sessionMiddleware, (c) => c.json({ data: c.get("user") }))

  // handle logout
  .post("/logout", sessionMiddleware, async (c) => {
    deleteCookie(c, cookie.SESSION);

    const account = c.get("account");
    await account.deleteSession("current");

    return c.json({ success: true });
  });
export default app;

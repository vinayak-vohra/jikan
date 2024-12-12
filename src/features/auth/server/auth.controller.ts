import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "./session.middleware";
import { cookie } from "../auth.cookies";
import { loginSchema, registerSchema } from "../auth.schemas";

import { createAdminClient } from "@/lib/appwrite";
import { APIException } from "@/lib/exception";
import { HTTPException } from "hono/http-exception";

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
    try {
      // extract email and password from request body
      const { email, password } = c.req.valid("json");

      // create an admin client
      const { account } = await createAdminClient();

      // create a session using the email and password
      const session = await account.createEmailPasswordSession(email, password);

      // set the session cookie
      setCookie(c, cookie.SESSION, session.secret, cookieOptions);

      // return success response
      return c.json({ success: true });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  })

  // handle Sign Up request
  .post("/register", zValidator("json", registerSchema), async (c) => {
    try {
      // extract email, name and password from request body
      const { email, name, password } = c.req.valid("json");

      // create an admin client
      const { account } = await createAdminClient();

      // create a new account
      await account.create(ID.unique(), email, password, name);

      // create a session using the email and password
      const session = await account.createEmailPasswordSession(email, password);

      // set the session cookie
      setCookie(c, cookie.SESSION, session.secret, cookieOptions);

      // return success response
      return c.json({ success: true });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  })

  // get current user details
  .get("/current", sessionMiddleware, (c) => c.json({ data: c.get("user") }))

  // handle logout
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      deleteCookie(c, cookie.SESSION);

      const account = c.get("account");
      await account.deleteSession("current");
      return c.json({ success: true });
    } catch (error: unknown) {
      if (error instanceof HTTPException) throw error;
      throw new APIException(error);
    }
  });

export default app;

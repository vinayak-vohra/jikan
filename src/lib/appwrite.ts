import { cookies } from "next/headers";
import { Account, Client, Databases, Users } from "node-appwrite";

import { cookie } from "@/features/auth/auth.cookies";

/**
 * Creates an admin client for interacting with Appwrite services using administrative privileges.
 *
 * @returns An object containing a reference to the authenticated `Account` service,
 *          allowing for administrative actions on user accounts.
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
  };
}

/**
 * Creates a session client for interacting with Appwrite services, including account and database management.
 * It retrieves the session cookie to authenticate the client. If the session cookie is not present or invalid,
 * an error is thrown, indicating that the user is unauthorized.
 *
 * @returns An object containing references to the authenticated `Account` and `Databases` services,
 *          allowing for further interaction with the user's account and associated databases.
 *
 * @throws Error if the session cookie is missing or invalid, indicating that the user is unauthorized.
 */
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = cookies().get(cookie.SESSION);

  if (!session || !session.value) {
    throw new Error("Unauthorized");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

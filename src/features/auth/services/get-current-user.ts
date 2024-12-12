"use server";

import { createSessionClient } from "@/lib/appwrite";
import { IUser } from "../auth.types";

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}

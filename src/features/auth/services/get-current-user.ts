"use server";

import { createSessionClient } from "@/lib/appwrite";

/**
 * Retrieves the current user's account information.
 * If an error occurs while fetching the account details, the function returns `null`.
 *
 * @returns A promise that resolves to the account information of the current user if found,
 *          or `null` if an error occurs during the retrieval process.
 */
export async function getCurrentUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}

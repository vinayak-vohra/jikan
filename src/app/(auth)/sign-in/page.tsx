import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";
import SignInForm from "@/features/auth/components/sign-in-form";

export default async function SignIn() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return <SignInForm />;
}

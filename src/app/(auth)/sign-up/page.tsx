import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services";
import SignupForm from "@/features/auth/components/sign-up-form";

export default async function SignUp() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return <SignupForm />;
}

import { redirect } from "next/navigation";

import ProjectIdClient from "./client";

import { getCurrentUser } from "@/features/auth/services";

export default async function ProjectIdPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <ProjectIdClient />;
}

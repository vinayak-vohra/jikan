import { getCurrentUser } from "@/features/auth/services";
import { redirect } from "next/navigation";
import ProjectSettingsClient from "./client";


export default async function ProjectSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <ProjectSettingsClient />;
}

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services/get-current-user";
import CreateWorkpaceForm from "@/features/workspaces/components/create-workspace-form";

export default async function CreateWorkspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full md:max-w-xl">
      <CreateWorkpaceForm />
    </div>
  );
}

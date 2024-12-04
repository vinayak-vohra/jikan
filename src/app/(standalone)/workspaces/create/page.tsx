import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services/get-current-user";
import CreateWorkpaceForm from "@/features/workspaces/components/create-workspace-form";
// import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";

const getWorkspaceName = (name: string) =>
  name.split(" ")[0].concat("'s workspace");

export default async function CreateWorkspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-[calc(90vh-90px)] py-5 flex flex-col items-center justify-evenly gap-5 w-full md:gap-0 md:max-w-5xl">
      <p className="text-2xl font-semibold">Let&apos;s get you started!</p>
      <div className="flex w-full gap-4 max-md:flex-col">
        <CreateWorkpaceForm defaultName={getWorkspaceName(user.name)} />
        {/* <div className="bg-background rounded-full h-1 w-auto lg:h-auto lg:w-1" />
        <JoinWorkspaceForm /> */}
      </div>
    </div>
  );
}

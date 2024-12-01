import { getCurrentUser } from "@/features/auth/services";
import { redirect } from "next/navigation";
import TaskIdClient from "./client";

export default async function TaskIdPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="p-4 w-full">
      <TaskIdClient />
    </div>
  );
}

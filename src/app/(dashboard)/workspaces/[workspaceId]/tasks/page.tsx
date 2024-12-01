import { getCurrentUser } from "@/features/auth/services";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";

export default async function TaskPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="h-dvh w-full p-4 flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
}

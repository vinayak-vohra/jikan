"use client";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import CreateProjectModal from "@/features/projects/components/create-project-modal";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import EditTaskModal from "@/features/tasks/components/edit-task-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import { PropsWithChildren } from "@/types/global.types";
import { Suspense } from "react";

export default function DashboardLayout(props: PropsWithChildren) {
  return (
    <Suspense>
      <div className="bg-secondary min-h-dvh">
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <CreateTaskModal />
        <EditTaskModal />
        <div className="flex w-full min-h-dvh">
          {/* Sidebar */}
          <div className="fixed left-0 top-0 hidden lg:block lg:w-80 h-dvh">
            <Sidebar />
          </div>
          <div className="lg:pl-80 w-full">
            <div className="mx-auto max-w-screen-2xl flex flex-col min-h-dvh">
              <Navbar />
              <main className="flex flex-col items-center justify-center py-2 h-full">
                {props.children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

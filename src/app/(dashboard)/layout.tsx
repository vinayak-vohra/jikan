import CreateProjectModal from "@/features/projects/components/create-project-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import { PropsWithChildren } from "@/types/global.types";

export default function DashboardLayout(props: PropsWithChildren) {
  return (
    <div className="bg-secondary min-h-dvh">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <div className="flex w-full h-dvh">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-dvh">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl flex flex-col h-dvh">
            <Navbar />
            <main className="h-full px-6 py-3 flex flex-col">
              {props.children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

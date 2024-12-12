"use client";
import { usePathname } from "next/navigation";

import Mobile from "../sidebar/mobile";

import UserAvatar from "@/features/auth/components/user-avatar";
import ThemeSwitcher from "../theme-switcher";

const pages = [
  {
    name: "Home",
    description: "Monitor all your projects and tasks here",
    path: "",
  },
  {
    name: "Settings",
    description: "Manage your workspace settings",
    path: "settings",
  },
  {
    name: "Members",
    description: "Manage your workspace members",
    path: "members",
  },
];

function getPageDetails(path: string) {
  const lastPath = path.split("/").pop();
  return pages.find((page) => page.path === lastPath) || pages[0];
}

export default function Navbar() {
  const pathname = usePathname();
  const { name, description } = getPageDetails(pathname);

  return (
    <nav className="px-6 py-2 border-s shadow w-full bg-background flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-xl font-semibold">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Mobile />
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <UserAvatar />
      </div>
    </nav>
  );
}

"use client";

import { SettingsIcon, UserIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks";

const pages = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

export default function Navigation() {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {pages.map((page) => {
        const href = "/workspaces/".concat(workspaceId, page.href);
        const isActive = pathname === href;
        const RenderIcon = isActive ? page.activeIcon : page.icon;

        return (
          <Link key={page.href} href={href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium text-neutral-500 hover:text-primary transition",
                isActive && "bg-accent shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <RenderIcon className="size-5 mr-2" />
              {page.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
}

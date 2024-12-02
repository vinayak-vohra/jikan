"use client";
import { useTheme } from "next-themes";
import { LogOutIcon, SunMoonIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { useCurrent, useLogout } from "@/features/auth/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserAvatar() {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();
  const { themes, theme, setTheme } = useTheme();

  if (isLoading) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  if (!user) return null;

  const { name, email } = user;
  const fallbackName = "User";

  const avatarFallback = (name || email || fallbackName)
    .charAt(0)
    .toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-secondary-foreground">
          <AvatarFallback className="bg-accent font-medium text-accent-foreground flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-48">
        <div className="flex items-center gap-4 px-4 py-2">
          {/* <Avatar className="size-10">
            <AvatarFallback className="bg-accent text-xl font-medium text-accent-foreground flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar> */}
          <div className="flex flex-col truncate">
            <p className="text-sm truncate font-medium text-foreground">
              {name || fallbackName}
            </p>
            <p className="text-xs truncate text-muted-foreground">{email}</p>
          </div>
        </div>
        {/* <Separator className="my-1" />
        <div className="flex text-sm text-muted-foreground items-center px-2 h-8">
          <SunMoonIcon className="size-4 mr-2" />
          <span>Theme</span>
          <div className="ml-auto">
            <Select onValueChange={setTheme} value={theme}>
              <SelectTrigger className="h-6 text-xs py-0 capitalize">
                <SelectValue placeholder="select" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem
                    className="capitalize cursor-pointer"
                    key={theme}
                    value={theme}
                  >
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div> */}
        <Separator className="my-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-8 mt-1 px-2 flex items-center text-rose-600 font-medium cursor-pointer"
        >
          <LogOutIcon className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

type ThemeIconProps = {
  type: "light" | "dark" | "system";
  className?: string;
};
const ThemeIcon: FC<ThemeIconProps> = (props) => {
  switch (props.type) {
    case "dark":
      return <MoonIcon className={props.className} />;
    case "light":
      return <SunIcon className={props.className} />;
    case "system":
      return <SunMoonIcon className={props.className} />;
  }
};

export default function ThemeSwitcher() {
  const { themes, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // prevent hydration warning for dynamic App Logo Image
  if (!mounted) return <Skeleton className="size-10 rounded-lg" />;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-10">
          <ThemeIcon
            type={theme as ThemeIconProps["type"]}
            className="size-5"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-32">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            className="capitalize"
          >
            <ThemeIcon
              type={theme as ThemeIconProps["type"]}
              className="size-4 mr-1"
            />
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

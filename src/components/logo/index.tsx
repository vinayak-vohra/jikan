"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Skeleton } from "../ui/skeleton";

export default function Logo() {
  const { theme, systemTheme } = useTheme();
  const appTheme = theme === "system" ? systemTheme : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // prevent hydration warning for dynamic App Logo Image
  if (!mounted)
    return (
      <div className="flex gap-2 h-9 items-center">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    );

  return (
    <Link suppressHydrationWarning href="/" className="flex gap-2 items-center">
      <Image
        suppressHydrationWarning
        src={`/jikan-${appTheme}.ico`}
        alt="logo"
        height={32}
        width={32}
      />
      <p className="text-[1.5rem] font-semibold font-playwrite">Jikan</p>
    </Link>
  );
}

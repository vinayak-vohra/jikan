"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "@/types/global.types";
import ThemeSwitcher from "@/components/theme-switcher";

export default function AuthLayout(props: PropsWithChildren) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/sign-in";

  return (
    <main className="bg-secondary min-h-dvh">
      <div className="mx-auto bg-background max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button asChild variant="outline">
              <Link href={isLoginPage ? "/sign-up" : "sign-in"}>
                {isLoginPage ? "Sign Up" : "Login"}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
      <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
        {props.children}
      </div>
    </main>
  );
}

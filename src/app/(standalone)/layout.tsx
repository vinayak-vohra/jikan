import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";
import UserAvatar from "@/features/auth/components/user-avatar";
import { PropsWithChildren } from "@/types/global.types";

export default function StandaloneLayout(props: PropsWithChildren) {
  return (
    <main className="bg-secondary min-h-dvh">
      <div className="mx-auto max-w-screen-2xl">
        <nav className="flex bg-background shadow justify-between items-center h-16 p-4">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <UserAvatar />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-2">
          {props.children}
        </div>
      </div>
    </main>
  );
}

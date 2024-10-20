
import Mobile from "../sidebar/mobile";
import UserAvatar from "@/features/auth/components/user-avatar";

export default function Navbar() {
  return (
    <nav className="px-6 pt-4 w-full flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all your projects and tasks here
        </p>
      </div>
      <Mobile />
      <UserAvatar />
    </nav>
  );
}

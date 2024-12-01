import Projects from "./projects";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Logo from "../logo";
import { Separator } from "../ui/separator";

export default function Sidebar() {
  return (
    <aside className="h-dvh bg-background p-4 w-full">
      <Logo />
      <Separator className="my-3" />
      <WorkspaceSwitcher />
      <Separator className="my-3" />
      <Navigation />
      <Separator className="my-3" />
      <Projects />
    </aside>
  );
}

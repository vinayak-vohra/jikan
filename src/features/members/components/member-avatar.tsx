import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  className?: string;
  fallbackClass?: string;
}
export default function MemberAvatar({
  name,
  className,
  fallbackClass,
}: WorkspaceAvatarProps) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback className={cn("capitalize", fallbackClass)}>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

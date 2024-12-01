import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  className?: string;
}
export default function MemberAvatar({
  name,
  className,
}: WorkspaceAvatarProps) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback className="capitalize">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

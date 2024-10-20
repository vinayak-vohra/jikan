import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  classname?: string;
}
export default function MemberAvatar({
  name,
  classname,
}: WorkspaceAvatarProps) {
  return (
    <Avatar className={cn("size-8", classname)}>
      <AvatarFallback className="text-white bg-blue-600 capitalize">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

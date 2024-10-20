import Image from "next/image";

import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  image?: string;
  classname?: string;
}
export default function WorkspaceAvatar({
  image,
  name,
  classname,
}: WorkspaceAvatarProps) {
  if (image)
    return (
      <div
        className={cn("size-8 relative rounded-md overflow-hidden", classname)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  return (
    <Avatar className={cn("size-8 rounded-md", classname)}>
      <AvatarFallback className="text-white bg-blue-600 capitalize rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

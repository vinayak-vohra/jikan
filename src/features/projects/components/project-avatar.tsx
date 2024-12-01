import Image from "next/image";

import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  name: string;
  image?: string;
  className?: string;
  size?: number;
}
export default function ProjectAvatar({
  image,
  name,
  className,
  size = 8,
}: ProjectAvatarProps) {
  if (image)
    return (
      <div
        className={cn(
          "relative rounded-md overflow-hidden",
          `size-${size}`,
          className
        )}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  return (
    <Avatar className={cn("rounded-md", `size-${size}`, className)}>
      <AvatarFallback className="text-white bg-blue-600 capitalize rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

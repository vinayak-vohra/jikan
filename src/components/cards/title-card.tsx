"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollHeight } from "@/hooks/use-scroll-height";

interface Props {
  title: string;
  forceShow?: boolean;
}

export function TitleCard({ title, forceShow }: Props) {
  const router = useRouter();
  const scrollHeight = useScrollHeight();

  return (
    <Card
      className={cn(
        "w-full h-full z-10 border-0 shadow-sm transition",
        "sticky top-0 md:top-3",
        !forceShow && "md:hidden",
        scrollHeight > 64 && "shadow-xl border"
      )}
    >
      <CardHeader className="px-3 py-3 md:px-7">
        <CardTitle className="flex flex-row gap-x-4 items-center text-xl">
          <Button variant="outline" size="xs" onClick={router.back}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

"use client";

import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from ".";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function Mobile() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTitle className="hidden">Mobile Sidebar</SheetTitle>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <MenuIcon className="size-5 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[264px]">
        <SheetDescription className="hidden">Mobile Sidebar</SheetDescription>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

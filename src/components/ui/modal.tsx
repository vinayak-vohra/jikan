import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./drawer";

import useMediaQuery from "@/hooks/use-media-query";
import { PropsWithChildren } from "@/types/global.types";

interface ResponsiveModalProps extends PropsWithChildren {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResponsiveModal(props: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 480px)");

  if (isDesktop)
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogTitle className="hidden">Create Workspace</DialogTitle>
        <DialogContent
          aria-describedby=""
          className="w-full rounded-lg sm:max-w-lg max-h-[85vh] p-0 border-none overflow-y-auto hide-scrollbar"
        >
          {props.children}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerTitle className="hidden">Create Workspace</DrawerTitle>
      <DrawerContent aria-describedby="">
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {props.children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

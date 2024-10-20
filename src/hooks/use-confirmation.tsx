"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveModal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";

interface IPromise {
  resolve: (isResolved: boolean) => void;
}
export interface IConfirmationDialog {
  title: React.ReactNode;
  description: React.ReactNode;
  variant: ButtonProps["variant"];
}
interface IUseConfirmation {
  (props: IConfirmationDialog): [() => JSX.Element, () => Promise<unknown>];
}

export const useConfirmation: IUseConfirmation = function ({
  title,
  description,
  variant = "primary",
}) {
  const [promise, setPromise] = useState<IPromise | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="px-7 py-5 max-md:py-3">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="px-7 py-5 max-md:py-3">
          <CardDescription className="text-justify">
            {description}
          </CardDescription>
        </CardContent>
        <div className="px-7">
          <Separator />
        </div>
        <CardFooter className="gap-x-7 md:justify-between px-7 py-5 max-md:py-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="max-md:w-full w-48"
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            className="max-md:w-full w-48"
          >
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};

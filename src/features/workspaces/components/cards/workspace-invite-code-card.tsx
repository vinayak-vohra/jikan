import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useInviteCode,
  useResetInviteCode,
  useWorkspaceId,
} from "@/features/workspaces/hooks";
import { IConfirmationDialog, useConfirmation } from "@/hooks/use-confirmation";
import { CopyIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

const dialogInfo: IConfirmationDialog = {
  title: "Reset Invite Code",
  description: (
    <span>
      Resetting the invite code will invalidate the current code, and a new one
      will be generated. Any pending invites using the old code will no longer
      be valid.
      <br />
      <br />
      Are you sure you want to proceed?
    </span>
  ),
  variant: "secondary",
};

interface InviteCodeCardProps {
  inviteCode: string;
}

export function WorkspaceInviteCodeCard({ inviteCode }: InviteCodeCardProps) {
  const inviteCodeRef = useRef<HTMLInputElement>(null);
  const { mutate: resetInviteCode, isPending: isResetting } =
    useResetInviteCode();
  const [ResetInviteDialog, confirmReset] = useConfirmation(dialogInfo);
  const workspaceId = useWorkspaceId();

  // Copy invite code to clipboard
  const copyToClipboard = () => {
    if (!inviteCodeRef.current) return;

    navigator.clipboard
      .writeText(inviteCodeRef.current.value)
      .then(() => {
        toast.success("Copied to clipboard", {
          icon: <CopyIcon />,
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Reset invite code
  const handleInviteCodeReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode({ param: { workspaceId } });
  };

  // Invite URL
  const inviteURL = `${window.location.origin}/workspaces/${workspaceId}/invite/${inviteCode}`;

  return (
    <>
      <ResetInviteDialog />
      <Card className="w-full h-full border-none shadow-none py-2">
        <CardHeader className="px-7 py-3">
          <CardTitle className="flex flex-row gap-x-4 items-center text-lg">
            Security
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="py-3 px-7">
          <div className="flex flex-col py-1.5 gap-y-2">
            <Label>Invite Code</Label>
            <p className="text-xs text-muted-foreground">
              This code allows you to invite new members to your workspace.
              Share it with others to grant them access.
            </p>
            <div className="flex gap-2 items-center">
              <Input
                readOnly
                ref={inviteCodeRef}
                className="h-8"
                value={inviteURL}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <CopyIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to Clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="py-3">
            <Separator />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isResetting}
              onClick={handleInviteCodeReset}
            >
              Reset Invite Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

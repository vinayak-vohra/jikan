import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useInviteCode,
  useJoinWorkspace,
  useWorkspaceId,
} from "@/features/workspaces/hooks";

import { useRouter } from "next/navigation";
import { IWorkspacePublicInfo } from "../../workspaces.types";

interface WorkspaceJoinCardProps {
  workspace: IWorkspacePublicInfo;
}

export function WorkspaceJoinCard({ workspace }: WorkspaceJoinCardProps) {
  const { mutate: joinWorkspace, isPending: isJoining } = useJoinWorkspace();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const router = useRouter();

  const handleJoin = () => {
    joinWorkspace(
      {
        param: { workspaceId: workspaceId },
        json: { inviteCode: inviteCode },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="p-7 gap-3 flex flex-col items-center">
        <WorkspaceAvatar
          classname="size-16 my-3"
          name={workspace.name}
          image={workspace.image}
        />
        <CardDescription className="text-center mt-3">
          <span className="capitalize">{workspace.admin.name}</span> invited you
          to join the workspace
        </CardDescription>
        <Label className="text-2xl font-semibold">{workspace.name}</Label>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardFooter className="px-7 py-3">
        <Button
          variant="primary"
          className="w-full"
          onClick={handleJoin}
          disabled={isJoining}
        >
          Accept Invitation
        </Button>
      </CardFooter>
    </Card>
  );
}

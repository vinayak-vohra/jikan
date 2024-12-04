import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    <Card className="w-full lg:px-4 max-w-lg mx-auto border-none shadow-none">
      <CardHeader className="flex pb-4 max-md:pt-4 flex-col items-center gap-3">
        <WorkspaceAvatar
          classname="size-16"
          name={workspace.name}
          image={workspace.image}
        />

        <CardTitle className="text-xl">{workspace.name}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 text-sm text-center pt-2 pb-4">
        <span className="capitalize">{workspace.admin.name}</span> invited you
        to join the workspace
      </CardContent>

      <CardFooter className="flex items-center justify-between py-4 border-t">
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

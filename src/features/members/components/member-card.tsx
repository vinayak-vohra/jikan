import { IMember, MemberRoles } from "@/features/members/members.types";
import MemberAvatar from "../../features/members/components/member-avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Loader2, MoreVerticalIcon } from "lucide-react";
import { useDeleteMember, useUpdateMember } from "@/features/members/hooks";
import { useConfirmation } from "@/hooks/use-confirmation";

type MemberCardProps = { member: IMember };

export function MemberCard({ member }: MemberCardProps) {
  const isAdmin = member.role === MemberRoles.ADMIN;
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const [ConfirmationDialog, confirmDelete] = useConfirmation({
    title: "Remove Member",
    description: <span></span>,
    variant: "destructive",
  });

  const handleUpdate = () => {
    updateMember({
      param: { memberId: member.$id },
      json: { role: isAdmin ? MemberRoles.MEMBER : MemberRoles.ADMIN },
    });
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (ok) {
      deleteMember({
        param: { memberId: member.$id },
      });
    }
  };

  return (
    <div key={member.$id} className="flex items-center gap-x-4">
      <ConfirmationDialog />
      <MemberAvatar name={member.name} />
      <div>
        <p className="text-sm font-semibold">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.email}</p>
      </div>

      <div className="ml-auto flex gap-x-4 items-center">
        {isAdmin && (
          <Badge variant="admin" className="capitalize ml-auto">
            {member.role.toLowerCase()}
          </Badge>
        )}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={isDeleting || isUpdating}
            >
              {isDeleting || isUpdating ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <MoreVerticalIcon className="size-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="right" className="w-48">
            <DropdownMenuItem onClick={handleUpdate}>
              {isAdmin ? "Remove Admin" : "Make Admin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              Remove from workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

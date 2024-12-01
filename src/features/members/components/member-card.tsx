import { IMember, MemberRoles } from "@/features/members/members.types";
import { Loader2, MoreVerticalIcon, TrashIcon, UserCogIcon, UserMinusIcon } from "lucide-react";
import { useDeleteMember, useUpdateMember } from "@/features/members/hooks";
import { useConfirmation } from "@/hooks/use-confirmation";
import MemberAvatar from "./member-avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type MemberCardProps = { member: IMember };

export function MemberCard({ member }: MemberCardProps) {
  const isAdmin = member.role === MemberRoles.ADMIN;
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const [ConfirmationDialog, confirmDelete] = useConfirmation({
    title: `Remove ${member.name}`,
    description: (
      <span>
        Are you sure you want to remove&nbsp;
        <span className="font-bold underline">{member.name}</span> from the
        workspace?
        <br />
        <br />
        This action cannot be undone, and&nbsp;
        <span className="font-bold underline">{member.name}</span> will lose all
        access to workspace resources.
      </span>
    ),
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
              variant="ghost"
              size="icon"
              disabled={isDeleting || isUpdating}
            >
              {isDeleting || isUpdating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MoreVerticalIcon className="size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className="w-48">
            <DropdownMenuItem onClick={handleUpdate}>
              {isAdmin ? (
                <UserMinusIcon className="size-4 mr-2" />
              ) : (
                <UserCogIcon className="size-4 mr-2" />
              )}
              {isAdmin ? "Remove as Admin" : "Make as Admin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <TrashIcon className="size-4 mr-2" />
              Remove User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

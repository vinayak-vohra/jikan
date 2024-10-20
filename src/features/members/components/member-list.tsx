"use client";

import { Fragment } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFetchMembers } from "@/features/members/hooks";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { MemberCard } from "../../../components/cards/member-card";

export default function MemberList() {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading } = useFetchMembers(workspaceId);

  if (isLoading) return "loading...";

  return (
    <Card className="w-full h-full border-none shadow-none py-2">
      <CardContent className="p-7 py-3 gap-y-4">
        {members?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <MemberCard member={member} />
            {index !== members.total - 1 && (
              <div className="py-3">
                <Separator />
              </div>
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

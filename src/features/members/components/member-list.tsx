"use client";

import { Fragment } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFetchMembers } from "@/features/members/hooks";
import { useWorkspaceId } from "@/features/workspaces/hooks";
import { MemberCard } from "./member-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberList() {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading } = useFetchMembers(workspaceId);

  return (
    <Card className="w-full h-full border-none shadow-none py-2">
      <CardContent className="p-7 py-3 gap-y-4">
        {isLoading && <MemberSkeleton />}
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

function MemberSkeleton({ count = 3 }: { count?: number }) {
  return [...Array(count)].map((_, i) => (
    <Fragment key={i}>
      <div className="flex items-center gap-x-4">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-16 h-2" />
        </div>
      </div>
      {i !== count - 1 && (
        <div className="py-3">
          <Separator />
        </div>
      )}
    </Fragment>
  ));
}

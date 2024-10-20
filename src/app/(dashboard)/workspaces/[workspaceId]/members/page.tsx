import { redirect } from "next/navigation";

import { TitleCard } from "@/components/cards/title-card";
import { getCurrentUser } from "@/features/auth/services";
import MemberList from "@/features/members/components/member-list";

export default async function MembersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full sm:max-w-md md:max-w-lg mx-auto flex flex-col gap-y-1 md:gap-y-4">
      <TitleCard title="Members" />
      <MemberList />
    </div>
  );
}

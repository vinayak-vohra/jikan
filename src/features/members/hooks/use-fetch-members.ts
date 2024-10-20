import { useQuery } from "@tanstack/react-query";

import { membersApi } from "@/lib/rpc";

export function useFetchMembers(workspaceId: string) {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await membersApi.$get({ query: { workspaceId } });

      if (!response.ok) throw new Error("Failed to fetch members");

      return (await response.json()).data;
    },
  });
  return query;
}

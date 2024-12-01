import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export function useFetchWorkspaceInfo(workspaceId: string) {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await api["workspaces"][":workspaceId"]["info"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspace");

      return (await response.json()).data;
    },
  });
  return query;
}

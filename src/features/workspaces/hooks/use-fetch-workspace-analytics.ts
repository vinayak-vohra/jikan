import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export function useFetchWorkspaceAnalytics(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await api["workspaces"][":workspaceId"]["analytics"]["$get"](
        { param: { workspaceId } }
      );

      if (!response.ok) throw new Error("Failed to fetch workspace analytics");

      return (await response.json()).data;
    },
  });
}

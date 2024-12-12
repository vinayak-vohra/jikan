import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchWorkspaceAnalytics(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await api["workspaces"][":workspaceId"]["analytics"][
        "$get"
      ]({ param: { workspaceId } });

      if (!response.ok)
        throw new CustomError(
          "Failed to fetch workspace analytics",
          await response.text()
        );

      return (await response.json()).data;
    },
  });
}

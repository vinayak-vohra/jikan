import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export function useFetchProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await api["projects"]["$get"]({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");

      return (await response.json()).data;
    },
  });
}

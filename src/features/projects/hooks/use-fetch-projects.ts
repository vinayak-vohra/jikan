import { projectsApi } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export function useFetchProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await projectsApi.$get({ query: { workspaceId } });

      if (!response.ok) throw new Error("Failed to fetch projects");

      return (await response.json()).data;
    },
  });
}

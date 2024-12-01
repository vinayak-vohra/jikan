import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export function useFetchProjectAnalytics(projectId: string) {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await api["projects"][":projectId"]["analytics"]["$get"](
        { param: { projectId } }
      );

      if (!response.ok) throw new Error("Failed to fetch project analytics");

      return (await response.json()).data;
    },
  });
}

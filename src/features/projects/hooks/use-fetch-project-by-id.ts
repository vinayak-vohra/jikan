import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";

export function useFetchProjectById(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api["projects"][":projectId"]["$get"]({
        param: { projectId },
      });

      if (!response.ok) throw new Error("Failed to fetch project");

      return (await response.json()).data;
    },
  });
}

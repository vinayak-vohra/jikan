import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchProjectAnalytics(projectId: string) {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await api["projects"][":projectId"]["analytics"]["$get"](
        { param: { projectId } }
      );

      if (!response.ok) 
        throw new CustomError("Failed to fetch project analytics", await response.text());

      return (await response.json()).data;
    },
  });
}

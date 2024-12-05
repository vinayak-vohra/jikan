import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await api["projects"]["$get"]({
        query: { workspaceId },
      });

      if (!response.ok) 
        throw new CustomError("Failed to fetch projects", await response.text());

      return (await response.json()).data;
    },
  });
}

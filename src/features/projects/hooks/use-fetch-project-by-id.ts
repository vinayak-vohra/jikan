import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchProjectById(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api["projects"][":projectId"]["$get"]({
        param: { projectId },
      });

      if (!response.ok) 
        throw new CustomError("Failed to fetch project", await response.text());

      return (await response.json()).data;
    },
  });
}

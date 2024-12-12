import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";
import { useQuery } from "@tanstack/react-query";

export function useFetchTaskById(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await api["tasks"][":taskId"]["$get"]({
        param: { taskId },
      });

      if (!response.ok) 
        throw new CustomError("Failed to fetch task", await response.text());

      return (await response.json()).data;
    },
  });
}

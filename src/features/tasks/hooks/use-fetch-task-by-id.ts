import { api } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export function useFetchTaskById(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await api["tasks"][":taskId"]["$get"]({
        param: { taskId },
      });

      if (!response.ok) throw new Error("Failed to fetch task");

      return (await response.json()).data;
    },
  });
}

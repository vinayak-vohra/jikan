import { api } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskFilters } from "../tasks.types";

export function useFetchTasks({ workspaceId, ...props }: TaskFilters) {
  return useQuery({
    queryKey: ["tasks", workspaceId, ...Object.values(props)],
    queryFn: async () => {
      const response = await api["tasks"]["$get"]({
        query: { workspaceId, ...props },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");

      return (await response.json()).data;
    },
  });
}

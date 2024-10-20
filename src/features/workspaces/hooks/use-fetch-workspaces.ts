import { useQuery } from "@tanstack/react-query";

import { workspaceApi } from "@/lib/rpc";

export function useFetchWorkspaces() {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await workspaceApi.$get();

      if (!response.ok) throw new Error("Failed to fetch workspace");

      return (await response.json()).data;
    },
  });
  return query;
}

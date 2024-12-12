import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchWorkspaces() {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api["workspaces"]["$get"]();

      if (!response.ok) 
        throw new CustomError("Failed to fetch workspaces", await response.text());

      return (await response.json()).data;
    },
  });
  return query;
}

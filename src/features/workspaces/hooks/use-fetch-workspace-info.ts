import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchWorkspaceInfo(workspaceId: string) {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await api["workspaces"][":workspaceId"]["info"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok) 
        throw new CustomError("Failed to fetch workspace", await response.text());

      return (await response.json()).data;
    },
  });
  return query;
}

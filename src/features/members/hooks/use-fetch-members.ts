import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";
import { CustomError } from "@/types/global.types";

export function useFetchMembers(workspaceId: string) {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await api["members"]["$get"]({ query: { workspaceId } });

      if (!response.ok)
        throw new CustomError("Failed to fetch members", await response.text());

      return (await response.json()).data;
    },
  });
  return query;
}

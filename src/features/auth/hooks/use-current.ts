import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useCurrent() {
  return useQuery({
    queryKey: ["current"],
    queryFn: async function () {
      const response = await client.api.auth.current.$get();
      
      if (!response.ok) return null;

      return (await response.json()).data;
    },
  });
}

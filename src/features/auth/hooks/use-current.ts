import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/rpc";

export function useCurrent() {
  return useQuery({
    queryKey: ["current"],
    queryFn: async function () {
      const response = await api["auth"]["current"]["$get"]();

      if (!response.ok) return null;

      return (await response.json()).data;
    },
  });
}

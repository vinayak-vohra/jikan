import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<(typeof api)["auth"]["logout"]["$post"]>;

export const useLogout = () => {
  const qc = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await api["auth"]["logout"]["$post"]();

      if (!response.ok) throw new Error("Failed to logout");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged out");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["current"] });
      qc.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: logError,
  });
  return mutation;
};

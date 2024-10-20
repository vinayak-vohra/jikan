import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { workspaceApi } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<typeof workspaceApi.$post>;
type RequestType = InferRequestType<typeof workspaceApi.$post>;

export function useCreateWorkspace() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await workspaceApi.$post({ form });

      if (!response.ok) throw new Error("Failed to create workspace");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("New workspace created");
      qc.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: logError
  });
  return mutation;
}

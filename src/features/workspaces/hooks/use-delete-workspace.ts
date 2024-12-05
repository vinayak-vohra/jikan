import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<
  (typeof api)["workspaces"][":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["workspaces"][":workspaceId"]["$delete"]
>;

export function useDeleteWorkspace() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api["workspaces"][":workspaceId"]["$delete"]({
        param,
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted");
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      qc.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}

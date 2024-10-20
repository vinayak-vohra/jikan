import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { workspaceApi } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof workspaceApi)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof workspaceApi)[":workspaceId"]["$patch"]
>;

export function useUpdateWorkspace() {
  const qc = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await workspaceApi[":workspaceId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) throw new Error("Failed to update workspace");

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      qc.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}

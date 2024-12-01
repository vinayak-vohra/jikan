import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof api)["workspaces"][":workspaceId"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["workspaces"][":workspaceId"]["join"]["$post"]
>;

export function useJoinWorkspace() {
  const qc = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await api["workspaces"][":workspaceId"]["join"]["$post"](
        {
          param,
          json,
        }
      );
      if (!response.ok) throw new Error("Failed to join workspace");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Joined workspace");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      qc.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}

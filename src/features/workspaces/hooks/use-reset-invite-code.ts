import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof api)["workspaces"][":workspaceId"]["reset-invite-code"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["workspaces"][":workspaceId"]["reset-invite-code"]["$post"]
>;

export function useResetInviteCode() {
  const qc = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api["workspaces"][":workspaceId"][
        "reset-invite-code"
      ]["$post"]({ param });
      if (!response.ok) throw new Error("Failed to reset invite code");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset successful");
      router.refresh();
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      qc.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: logError,
  });
  return mutation;
}

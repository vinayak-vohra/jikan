import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<
  (typeof api)["members"][":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["members"][":memberId"]["$delete"]
>;

export function useDeleteMember() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api["members"][":memberId"]["$delete"]({ param });
      const res = await response.json();

      if ("error" in res) throw new Error(res.error);

      return res;
    },
    onSuccess: () => {
      toast.success("Member removed");
      qc.invalidateQueries({ queryKey: ["members"] });
    },
    onError: logError,
  });
  return mutation;
}

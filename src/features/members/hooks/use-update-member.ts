import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { logError } from "@/lib/utils";

type ResponseType = InferResponseType<
  (typeof api)["members"][":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof api)["members"][":memberId"]["$patch"]
>;

export function useUpdateMember() {
  const qc = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await api["members"][":memberId"]["$patch"]({
        param,
        json,
      });
      const res = await response.json();

      if ("error" in res) throw new Error(res.error);

      return res;
    },
    onSuccess: () => {
      toast.success("Member role updated");
      qc.invalidateQueries({ queryKey: ["members"] });
    },
    onError: logError,
  });
  return mutation;
}
